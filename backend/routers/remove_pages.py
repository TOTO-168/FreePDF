import io
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter, PdfReader

router = APIRouter()


@router.post("/remove-pages")
async def remove_pages(
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

    pages_to_remove = set()
    for part in pages_str.split(","):
        part = part.strip()
        if "-" in part:
            s, e = part.split("-", 1)
            pages_to_remove.update(range(int(s.strip()) - 1, int(e.strip())))
        elif part:
            pages_to_remove.add(int(part.strip()) - 1)

    writer = PdfWriter()
    for i, page in enumerate(reader.pages):
        if i not in pages_to_remove:
            writer.add_page(page)

    if len(writer.pages) == 0:
        raise HTTPException(status_code=400, detail="無法移除所有頁面")

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=removed.pdf"},
    )
