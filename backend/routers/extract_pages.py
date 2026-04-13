import io
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter, PdfReader

router = APIRouter()


@router.post("/extract-pages")
async def extract_pages(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案")

    opts = json.loads(options)
    pages_str = opts.get("pages", "")

    data = await files[0].read()
    reader = PdfReader(io.BytesIO(data))
    total = len(reader.pages)

    pages_to_extract: set[int] = set()
    for part in pages_str.split(","):
        part = part.strip()
        if "-" in part:
            s, e = part.split("-", 1)
            pages_to_extract.update(range(int(s.strip()) - 1, int(e.strip())))
        elif part:
            pages_to_extract.add(int(part.strip()) - 1)

    pages_to_extract = {p for p in pages_to_extract if 0 <= p < total}

    if not pages_to_extract:
        raise HTTPException(status_code=400, detail="請指定要提取的頁面")

    writer = PdfWriter()
    for i in sorted(pages_to_extract):
        writer.add_page(reader.pages[i])

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=extracted.pdf"},
    )
