import io
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter, PdfReader
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

router = APIRouter()


def create_text_watermark(text: str, opacity: float, position: str, page_width: float, page_height: float) -> bytes:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(page_width, page_height))
    c.setFillColorRGB(0.5, 0.5, 0.5, alpha=opacity)

    font_size = min(page_width, page_height) * 0.08
    c.setFont("Helvetica", font_size)

    if position in ("對角", "diagonal"):
        c.saveState()
        c.translate(page_width / 2, page_height / 2)
        c.rotate(45)
        c.drawCentredString(0, 0, text)
        c.restoreState()
    elif position in ("重複", "repeat"):
        c.saveState()
        c.translate(page_width / 2, page_height / 2)
        c.rotate(30)
        step_x = page_width * 0.4
        step_y = page_height * 0.3
        for dx in [-step_x, 0, step_x]:
            for dy in [-step_y * 1.5, -step_y * 0.5, step_y * 0.5, step_y * 1.5]:
                c.drawCentredString(dx, dy, text)
        c.restoreState()
    elif position in ("置中", "center"):
        c.drawCentredString(page_width / 2, page_height / 2, text)
    elif position in ("左上", "top-left"):
        c.drawString(40, page_height - 50, text)
    elif position in ("右下", "bottom-right"):
        c.drawRightString(page_width - 40, 40, text)
    else:
        c.drawCentredString(page_width / 2, page_height / 2, text)

    c.save()
    buf.seek(0)
    return buf.getvalue()


@router.post("/watermark")
async def add_watermark(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案")

    opts = json.loads(options)
    wm_type = opts.get("type", "text")
    text = opts.get("text", "FreePDF")
    opacity = float(opts.get("opacity", 0.3))
    position = opts.get("position", "對角")

    data = await files[0].read()
    reader = PdfReader(io.BytesIO(data))
    writer = PdfWriter()

    for page in reader.pages:
        w = float(page.mediabox.width)
        h = float(page.mediabox.height)
        wm_data = create_text_watermark(text, opacity, position, w, h)
        wm_reader = PdfReader(io.BytesIO(wm_data))
        wm_page = wm_reader.pages[0]
        page.merge_page(wm_page)
        writer.add_page(page)

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=watermarked.pdf"},
    )
