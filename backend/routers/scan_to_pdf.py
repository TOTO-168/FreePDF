import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from PIL import Image
from pypdf import PdfWriter
from reportlab.pdfgen import canvas as rl_canvas

router = APIRouter()


@router.post("/scan-to-pdf")
async def scan_to_pdf(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳掃描圖片")

    from pypdf import PdfReader

    writer = PdfWriter()

    for f in files:
        data = await f.read()
        img = Image.open(io.BytesIO(data))

        # Auto-rotate based on EXIF
        try:
            from PIL import ImageOps
            img = ImageOps.exif_transpose(img)
        except Exception:
            pass

        if img.mode in ("RGBA", "P", "LA"):
            img = img.convert("RGB")

        # Convert to grayscale for scan effect
        w, h = img.size
        buf = io.BytesIO()
        c = rl_canvas.Canvas(buf, pagesize=(w, h))
        img_buf = io.BytesIO()
        img.save(img_buf, format="JPEG", quality=88)
        img_buf.seek(0)
        c.drawImage(img_buf, 0, 0, width=w, height=h)  # type: ignore[arg-type]
        c.save()
        buf.seek(0)

        reader = PdfReader(buf)
        writer.add_page(reader.pages[0])

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=scanned.pdf"},
    )
