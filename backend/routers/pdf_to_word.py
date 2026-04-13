import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter()


@router.post("/pdf-to-word")
async def pdf_to_word(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案")

    try:
        from pdf2docx import Converter
    except ImportError:
        raise HTTPException(status_code=501, detail="需要安裝 pdf2docx 才能使用此功能")

    import tempfile, os
    data = await files[0].read()

    with tempfile.TemporaryDirectory() as tmpdir:
        pdf_path = os.path.join(tmpdir, "input.pdf")
        docx_path = os.path.join(tmpdir, "output.docx")

        with open(pdf_path, "wb") as fp:
            fp.write(data)

        cv = Converter(pdf_path)
        cv.convert(docx_path, start=0, end=None)
        cv.close()

        with open(docx_path, "rb") as fp:
            docx_data = fp.read()

    return StreamingResponse(
        io.BytesIO(docx_data),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=converted.docx"},
    )
