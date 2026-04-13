import io
import json
import zipfile
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter, PdfReader

router = APIRouter()


def parse_ranges(ranges_str: str, total: int) -> list[list[int]]:
    """Parse range string like '1-3,5,7-10' into list of page index lists."""
    result = []
    parts = [p.strip() for p in ranges_str.split(",") if p.strip()]
    for part in parts:
        if "-" in part:
            start, end = part.split("-", 1)
            s, e = int(start.strip()) - 1, int(end.strip()) - 1
            result.append(list(range(max(0, s), min(total - 1, e) + 1)))
        else:
            idx = int(part.strip()) - 1
            if 0 <= idx < total:
                result.append([idx])
    return result


@router.post("/split")
async def split_pdf(
    files: list[UploadFile] = File(...),
    options: str = Form(default="{}"),
):
    if not files:
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案")

    opts = json.loads(options)
    mode = opts.get("mode", "all")

    data = await files[0].read()
    reader = PdfReader(io.BytesIO(data))
    total = len(reader.pages)

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        if mode == "all":
            for i, page in enumerate(reader.pages):
                writer = PdfWriter()
                writer.add_page(page)
                buf = io.BytesIO()
                writer.write(buf)
                zf.writestr(f"page_{i+1:03d}.pdf", buf.getvalue())

        elif mode == "range":
            ranges = parse_ranges(opts.get("ranges", ""), total)
            for idx, pages in enumerate(ranges):
                writer = PdfWriter()
                for p in pages:
                    writer.add_page(reader.pages[p])
                buf = io.BytesIO()
                writer.write(buf)
                zf.writestr(f"part_{idx+1:02d}.pdf", buf.getvalue())

        elif mode == "interval":
            interval = int(opts.get("interval", 1))
            for i in range(0, total, interval):
                writer = PdfWriter()
                for p in range(i, min(i + interval, total)):
                    writer.add_page(reader.pages[p])
                buf = io.BytesIO()
                writer.write(buf)
                zf.writestr(f"part_{i//interval+1:02d}.pdf", buf.getvalue())

    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=split.zip"},
    )
