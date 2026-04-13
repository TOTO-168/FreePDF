import io
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter, PdfReader

router = APIRouter()


@router.post("/merge")
async def merge_pdf(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="請至少上傳 2 個 PDF 檔案")

    opts = json.loads(options)
    sort_by = opts.get("sortBy", "order")

    file_data = [(f.filename or "", await f.read()) for f in files]

    if sort_by == "name":
        file_data.sort(key=lambda x: x[0].lower())

    writer = PdfWriter()
    for _, data in file_data:
        reader = PdfReader(io.BytesIO(data))
        for page in reader.pages:
            writer.add_page(page)

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=merged.pdf"},
    )
