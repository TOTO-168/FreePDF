import io
import subprocess
import tempfile
import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter()


@router.post("/ppt-to-pdf")
async def ppt_to_pdf(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PPT 檔案")

    f = files[0]
    data = await f.read()

    with tempfile.TemporaryDirectory() as tmpdir:
        ext = os.path.splitext(f.filename or "input.pptx")[1] or ".pptx"
        input_path = os.path.join(tmpdir, f"input{ext}")
        output_path = os.path.join(tmpdir, "input.pdf")

        with open(input_path, "wb") as fp:
            fp.write(data)

        for libreoffice in ["libreoffice", "soffice", "/Applications/LibreOffice.app/Contents/MacOS/soffice"]:
            try:
                result = subprocess.run(
                    [libreoffice, "--headless", "--convert-to", "pdf", "--outdir", tmpdir, input_path],
                    capture_output=True, timeout=60
                )
                if result.returncode == 0 and os.path.exists(output_path):
                    with open(output_path, "rb") as fp:
                        pdf_data = fp.read()
                    return StreamingResponse(
                        io.BytesIO(pdf_data),
                        media_type="application/pdf",
                        headers={"Content-Disposition": "attachment; filename=converted.pdf"},
                    )
            except (FileNotFoundError, subprocess.TimeoutExpired):
                continue

        raise HTTPException(
            status_code=501,
            detail="需要安裝 LibreOffice 才能轉換 PPT 檔案。請至 libreoffice.org 下載安裝。"
        )
