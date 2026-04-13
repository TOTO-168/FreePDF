import io
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter, PdfReader
from pypdf.generic import RectangleObject

router = APIRouter()


@router.post("/crop")
async def crop_pdf(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案")

    opts = json.loads(options)
    # margin in points (72 pts = 1 inch)
    top = float(opts.get("top", 0))
    bottom = float(opts.get("bottom", 0))
    left = float(opts.get("left", 0))
    right = float(opts.get("right", 0))

    data = await files[0].read()
    reader = PdfReader(io.BytesIO(data))
    writer = PdfWriter()

    for page in reader.pages:
        box = page.mediabox
        x0 = float(box.left) + left
        y0 = float(box.bottom) + bottom
        x1 = float(box.right) - right
        y1 = float(box.top) - top
        page.mediabox = RectangleObject([x0, y0, x1, y1])
        page.cropbox = RectangleObject([x0, y0, x1, y1])
        writer.add_page(page)

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=cropped.pdf"},
    )
