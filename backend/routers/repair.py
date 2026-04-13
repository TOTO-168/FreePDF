import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
import pikepdf

router = APIRouter()


@router.post("/repair")
async def repair_pdf(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案")

    data = await files[0].read()

    try:
        pdf = pikepdf.open(io.BytesIO(data), suppress_warnings=True)
        output = io.BytesIO()
        pdf.save(output)
        output.seek(0)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"無法修復此 PDF：{str(e)}")

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=repaired.pdf"},
    )
