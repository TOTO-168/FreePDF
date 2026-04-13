import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from PIL import Image
from pypdf import PdfWriter
import reportlab.lib.pagesizes as pagesizes
from reportlab.pdfgen import canvas

router = APIRouter()


@router.post("/jpg-to-pdf")
async def jpg_to_pdf(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳圖片檔案")

    writer = PdfWriter()

    for f in files:
        data = await f.read()
        img = Image.open(io.BytesIO(data))
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        w, h = img.size
        buf = io.BytesIO()
        c = canvas.Canvas(buf, pagesize=(w, h))
        img_buf = io.BytesIO()
        img.save(img_buf, format="JPEG", quality=92)
        img_buf.seek(0)
        c.drawImage(
            img_buf,  # type: ignore[arg-type]
            0, 0, width=w, height=h,
            preserveAspectRatio=True
        )
        c.save()
        buf.seek(0)

        from pypdf import PdfReader
        page_reader = PdfReader(buf)
        writer.add_page(page_reader.pages[0])

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=images.pdf"},
    )
