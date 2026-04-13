from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import merge, split, compress, rotate, watermark, page_numbers
from routers import jpg_to_pdf, pdf_to_jpg, ocr, repair, remove_pages, extract_pages
from routers import word_to_pdf, pdf_to_word, ppt_to_pdf, excel_to_pdf, html_to_pdf
from routers import pdf_to_ppt, pdf_to_excel, pdf_to_pdfa, crop, scan_to_pdf, edit

app = FastAPI(title="FreePDF API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(merge.router, prefix="/api")
app.include_router(split.router, prefix="/api")
app.include_router(compress.router, prefix="/api")
app.include_router(rotate.router, prefix="/api")
app.include_router(watermark.router, prefix="/api")
app.include_router(page_numbers.router, prefix="/api")
app.include_router(jpg_to_pdf.router, prefix="/api")
app.include_router(pdf_to_jpg.router, prefix="/api")
app.include_router(ocr.router, prefix="/api")
app.include_router(repair.router, prefix="/api")
app.include_router(remove_pages.router, prefix="/api")
app.include_router(extract_pages.router, prefix="/api")
app.include_router(word_to_pdf.router, prefix="/api")
app.include_router(pdf_to_word.router, prefix="/api")
app.include_router(ppt_to_pdf.router, prefix="/api")
app.include_router(excel_to_pdf.router, prefix="/api")
app.include_router(html_to_pdf.router, prefix="/api")
app.include_router(pdf_to_ppt.router, prefix="/api")
app.include_router(pdf_to_excel.router, prefix="/api")
app.include_router(pdf_to_pdfa.router, prefix="/api")
app.include_router(crop.router, prefix="/api")
app.include_router(scan_to_pdf.router, prefix="/api")
app.include_router(edit.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok", "service": "FreePDF API"}
