import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter()


@router.post("/ocr")
async def ocr_pdf(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案")

    try:
        import pytesseract
        from pdf2image import convert_from_bytes
        from reportlab.pdfgen import canvas
        from pypdf import PdfWriter, PdfReader
    except ImportError:
        raise HTTPException(
            status_code=501,
            detail="需要安裝 tesseract、pdf2image 和 poppler 才能使用 OCR 功能"
        )

    data = await files[0].read()
    images = convert_from_bytes(data, dpi=200)

    writer = PdfWriter()

    for img in images:
        w, h = img.size
        # Get OCR text as PDF
        pdf_bytes = pytesseract.image_to_pdf_or_hocr(img, extension='pdf', lang='chi_tra+eng')
        reader = PdfReader(io.BytesIO(pdf_bytes))
        writer.add_page(reader.pages[0])

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=ocr.pdf"},
    )
