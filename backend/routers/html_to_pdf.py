import io
import subprocess
import tempfile
import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter()


@router.post("/html-to-pdf")
async def html_to_pdf(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 HTML 檔案")

    data = await files[0].read()

    with tempfile.TemporaryDirectory() as tmpdir:
        html_path = os.path.join(tmpdir, "input.html")
        output_path = os.path.join(tmpdir, "output.pdf")

        with open(html_path, "wb") as fp:
            fp.write(data)

        # Try wkhtmltopdf
        try:
            result = subprocess.run(
                ["wkhtmltopdf", html_path, output_path],
                capture_output=True, timeout=30
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
            pass

        raise HTTPException(
            status_code=501,
            detail="需要安裝 wkhtmltopdf 才能轉換 HTML。可用 brew install wkhtmltopdf 安裝。"
        )
