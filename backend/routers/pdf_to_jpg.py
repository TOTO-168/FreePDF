import io
import zipfile
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
import pikepdf
from PIL import Image

router = APIRouter()


@router.post("/pdf-to-jpg")
async def pdf_to_jpg(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案")

    data = await files[0].read()

    # Use pdf2image if available, otherwise use pikepdf + PIL
    try:
        from pdf2image import convert_from_bytes
        images = convert_from_bytes(data, dpi=150)
    except ImportError:
        raise HTTPException(
            status_code=501,
            detail="需要安裝 pdf2image 和 poppler 才能使用此功能"
        )

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for i, img in enumerate(images):
            buf = io.BytesIO()
            img.save(buf, "JPEG", quality=92)
            zf.writestr(f"page_{i+1:03d}.jpg", buf.getvalue())

    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=pages.zip"},
    )
