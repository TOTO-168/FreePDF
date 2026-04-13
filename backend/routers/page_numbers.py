import io
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter, PdfReader
from reportlab.pdfgen import canvas

router = APIRouter()


def format_page_number(fmt: str, current: int, total: int) -> str:
    if fmt == "page-n":
        return f"第 {current} 頁"
    elif fmt == "n-of-total":
        return f"{current} / {total}"
    elif fmt == "roman":
        numerals = [
            (1000, 'M'), (900, 'CM'), (500, 'D'), (400, 'CD'),
            (100, 'C'), (90, 'XC'), (50, 'L'), (40, 'XL'),
            (10, 'X'), (9, 'IX'), (5, 'V'), (4, 'IV'), (1, 'I')
        ]
        result = ''
        n = current
        for value, symbol in numerals:
            while n >= value:
                result += symbol
                n -= value
        return result
    else:
        return str(current)


@router.post("/page-numbers")
async def add_page_numbers(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案")

    opts = json.loads(options)
    position = opts.get("position", "bottom-center")
    fmt = opts.get("format", "n")
    start = int(opts.get("startPage", 1))

    data = await files[0].read()
    reader = PdfReader(io.BytesIO(data))
    writer = PdfWriter()
    total = len(reader.pages)

    for i, page in enumerate(reader.pages):
        w = float(page.mediabox.width)
        h = float(page.mediabox.height)
        num_text = format_page_number(fmt, i + start, total)

        buf = io.BytesIO()
        c = canvas.Canvas(buf, pagesize=(w, h))
        c.setFont("Helvetica", 10)
        c.setFillColorRGB(0.3, 0.3, 0.3)

        margin = 28
        if "bottom" in position:
            y = margin
        else:
            y = h - margin

        if "center" in position:
            c.drawCentredString(w / 2, y, num_text)
        elif "right" in position:
            c.drawRightString(w - margin, y, num_text)
        else:
            c.drawString(margin, y, num_text)

        c.save()
        buf.seek(0)

        num_reader = PdfReader(buf)
        page.merge_page(num_reader.pages[0])
        writer.add_page(page)

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=numbered.pdf"},
    )
