import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
import pikepdf
from pikepdf import Dictionary, Name, Array

router = APIRouter()


@router.post("/pdf-to-pdfa")
async def pdf_to_pdfa(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案")

    data = await files[0].read()

    try:
        pdf = pikepdf.open(io.BytesIO(data))

        # Add basic PDF/A metadata
        with pdf.open_metadata() as meta:
            meta["dc:format"] = "application/pdf"
            meta["pdfaid:part"] = "1"
            meta["pdfaid:conformance"] = "B"

        output = io.BytesIO()
        pdf.save(output)
        output.seek(0)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"轉換失敗：{str(e)}")

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=converted-pdfa.pdf"},
    )
