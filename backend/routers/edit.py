import io
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter, PdfReader
from reportlab.pdfgen import canvas

router = APIRouter()


@router.post("/edit")
async def edit_pdf(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    """Add text annotations to PDF."""
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案")

    opts = json.loads(options)
    annotations = opts.get("annotations", [])  # [{page, x, y, text, size, color}]

    data = await files[0].read()
    reader = PdfReader(io.BytesIO(data))
    writer = PdfWriter()

    for i, page in enumerate(reader.pages):
        w = float(page.mediabox.width)
        h = float(page.mediabox.height)

        page_annotations = [a for a in annotations if a.get("page", 0) == i]

        if page_annotations:
            buf = io.BytesIO()
            c = canvas.Canvas(buf, pagesize=(w, h))
            for ann in page_annotations:
                text = ann.get("text", "")
                x = float(ann.get("x", 0))
                y = h - float(ann.get("y", 0))  # Flip Y axis
                size = float(ann.get("size", 12))
                color = ann.get("color", "#000000")

                # Parse hex color
                r = int(color[1:3], 16) / 255
                g = int(color[3:5], 16) / 255
                b = int(color[5:7], 16) / 255

                c.setFillColorRGB(r, g, b)
                c.setFont("Helvetica", size)
                c.drawString(x, y, text)
            c.save()
            buf.seek(0)
            overlay = PdfReader(buf)
            page.merge_page(overlay.pages[0])

        writer.add_page(page)

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=edited.pdf"},
    )
