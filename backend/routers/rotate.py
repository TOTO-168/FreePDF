import io
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter, PdfReader

router = APIRouter()


def parse_page_range(page_range: str, total: int) -> set[int]:
    pages = set()
    for part in page_range.split(","):
        part = part.strip()
        if "-" in part:
            s, e = part.split("-", 1)
            pages.update(range(int(s.strip()) - 1, int(e.strip())))
        elif part:
            pages.add(int(part) - 1)
    return {p for p in pages if 0 <= p < total}


@router.post("/rotate")
async def rotate_pdf(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案")

    opts = json.loads(options)
    angle = int(opts.get("angle", 90))
    pages_mode = opts.get("pages", "all")
    page_range = opts.get("pageRange", "")

    data = await files[0].read()
    reader = PdfReader(io.BytesIO(data))
    writer = PdfWriter()
    total = len(reader.pages)

    target_pages = (
        parse_page_range(page_range, total)
        if pages_mode == "specific" and page_range
        else set(range(total))
    )

    for i, page in enumerate(reader.pages):
        if i in target_pages:
            page.rotate(angle)
        writer.add_page(page)

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=rotated.pdf"},
    )
