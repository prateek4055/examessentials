import os
import io
import requests
import resend
import base64
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Access secrets from environment variables
WORKER_SECRET = os.getenv("WORKER_SECRET", "ExamNotes@2026")
resend.api_key = os.getenv("RESEND_API_KEY")

def create_diagonal_watermark_buffer(text: str):
    packet = io.BytesIO()
    can = canvas.Canvas(packet, pagesize=(595, 842))
    can.setFont("Helvetica-Bold", 45)
    can.setFillGray(0.5, 0.4)
    can.saveState()
    can.translate(300, 420)
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
    email = data.get("email")
    order_id = data.get("order_id", "N/A")

    if not pdf_url:
        raise HTTPException(status_code=400, detail="Missing pdf_url")

    try:
        # 1. Download source PDF using secure Bearer authentication
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        headers = {"Authorization": f"Bearer {supabase_key}"} if supabase_key else {}
        
        # If the URL is set as public but the bucket is restricted, convert it to an authenticated endpoint
        if supabase_key and "/object/public/" in pdf_url:
            pdf_url = pdf_url.replace("/object/public/", "/object/authenticated/")

        resp = requests.get(pdf_url, headers=headers)
        if resp.status_code != 200:
            raise Exception(f"Failed to download PDF from {pdf_url}: HTTP {resp.status_code} - {resp.text}")

        reader = PdfReader(io.BytesIO(resp.content))
        writer = PdfWriter()

        # 2. Create watermark
        watermark_text = f"Licensed to: {student_name} ({phone})"
        watermark_pdf_buffer = create_diagonal_watermark_buffer(watermark_text)
        watermark_reader = PdfReader(watermark_pdf_buffer)
        watermark_page = watermark_reader.pages[0]

        # 3. Apply watermark
        for page in reader.pages:
            page.merge_page(watermark_page)
            writer.add_page(page)

        # 4. Password Protection
        if phone:
            writer.encrypt(
                user_password=phone,
                owner_password=os.urandom(16).hex(),
                permissions_flag=0
            )

        output_buffer = io.BytesIO()
        writer.write(output_buffer)
        processed_data = output_buffer.getvalue()

        # 5. Send Email if requested
        if email:
            if not resend.api_key:
                raise Exception("Missing RESEND_API_KEY in environment")
            
            # Encode PDF for attachment
            attachment = base64.b64encode(processed_data).decode()
            
            resend.Emails.send({
                "from": "Exam Essentials <notes@examessentials.in>",
                "to": email,
                "subject": f"Your Study Material - Order #{order_id}",
                "html": f"<p>Hello {student_name},</p><p>Thank you for your purchase! Attached is your watermarked PDF.</p><p><strong>Password:</strong> Your mobile number ({phone})</p><p>Regards,<br>Exam Essentials Team</p>",
                "attachments": [
                    {
                        "content": attachment,
                        "filename": "StudyMaterial.pdf"
                    }
                ]
            })
            return {"status": "success", "message": f"PDF processed and emailed to {email}"}

        # Return PDF binary if no email provided
        return Response(content=processed_data, media_type="application/pdf")

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
