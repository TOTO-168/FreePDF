import io
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
import pikepdf

router = APIRouter()


@router.post("/compress")
async def compress_pdf(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案")

    opts = json.loads(options)
    level = opts.get("level", "medium")

    data = await files[0].read()

    compress_level = {
        "low": pikepdf.models.PdfImage.JPEG_DEFAULT_QUALITY,
        "medium": 60,
        "high": 35,
    }.get(level, 60)

    pdf = pikepdf.open(io.BytesIO(data))
    output = io.BytesIO()

    # Compress images in the PDF
    for page in pdf.pages:
        for key, obj in list(page.images.items()):
            try:
                pdfimage = pikepdf.models.PdfImage(obj)
                pil_image = pdfimage.as_pil_image()
                compressed = io.BytesIO()
                if pil_image.mode in ("RGBA", "P"):
                    pil_image = pil_image.convert("RGB")
                pil_image.save(compressed, "JPEG", quality=compress_level, optimize=True)
                compressed.seek(0)
                obj.write(compressed.read(), filter=pikepdf.Name("/DCTDecode"))
            except Exception:
                pass

    pdf.save(output, compress_streams=True, recompress_flate=True)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=compressed.pdf"},
    )
