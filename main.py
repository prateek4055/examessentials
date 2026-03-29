import os
import io
import requests
from fastapi import FastAPI, HTTPException, Request, Response
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

app = FastAPI()

# Access secret from environment variables
WORKER_SECRET = os.getenv("WORKER_SECRET", "ExamNotes@2026")

def create_diagonal_watermark_buffer(text: str):
    """
    Creates a single-page PDF in memory containing a diagonal watermark.
    """
    packet = io.BytesIO()
    # A4 size roughly 595 x 842
    can = canvas.Canvas(packet, pagesize=(595, 842))
    
    # Set appearance
    can.setFont("Helvetica-Bold", 45)
    can.setFillGray(0.5, 0.4) # 50% gray, 40% opacity
    
    # Position and rotate
    can.saveState()
    can.translate(300, 420) # center approx
    can.rotate(45)
    can.drawCentredString(0, 0, text)
    can.restoreState()
    
    can.save()
    packet.seek(0)
    return packet

@app.get("/")
async def health():
    return {"message": "PDF Automation Worker is Live 🚀"}

@app.post("/process-pdf")
async def process_pdf(request: Request):
    # Security header check
    token = request.headers.get("x-worker-secret")
    if token != WORKER_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    pdf_url = data.get("pdf_url")
    student_name = data.get("student_name", "Student")
    phone = data.get("phone", "")

    if not pdf_url:
        raise HTTPException(status_code=400, detail="Missing pdf_url")

    try:
        # 1. Download source PDF
        resp = requests.get(pdf_url)
        if resp.status_code != 200:
            raise Exception(f"Failed to download PDF from {pdf_url}")

        reader = PdfReader(io.BytesIO(resp.content))
        writer = PdfWriter()

        # 2. Create watermark resources
        watermark_text = f"Licensed to: {student_name} ({phone})"
        watermark_pdf_buffer = create_diagonal_watermark_buffer(watermark_text)
        watermark_reader = PdfReader(watermark_pdf_buffer)
        watermark_page = watermark_reader.pages[0]

        # 3. Apply watermark to each page
        for page in reader.pages:
            page.merge_page(watermark_page)
            writer.add_page(page)

        # 4. Add Password Protection (Encryption)
        if phone:
            # Permissions: only printing allowed (0 = locked down except viewing)
            writer.encrypt(
                user_password=phone,
                owner_password=os.urandom(16).hex(),
                permissions_flag=0 # No copying, no editing
            )

        # 5. Return processed PDF binary
        output_buffer = io.BytesIO()
        writer.write(output_buffer)
        processed_data = output_buffer.getvalue()

        return Response(
            content=processed_data,
            media_type="application/pdf"
        )

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Default port for many cloud providers
    uvicorn.run(app, host="0.0.0.0", port=7860)
