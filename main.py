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
from supabase import create_client, Client

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

def create_invoice_pdf(order_id, student_name, email, phone, product_name, price):
    packet = io.BytesIO()
    c = canvas.Canvas(packet, pagesize=letter)
    
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, 750, "Exam Essentials, India")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, 720, f"Invoice Number: INV-{order_id}")
    c.drawString(50, 705, f"Billed To: {student_name}")
    c.drawString(50, 690, f"Email: {email}")
    c.drawString(50, 675, f"Phone: {phone}")
    
    c.line(50, 650, 550, 650)
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 630, "Description")
    c.drawString(450, 630, "Amount")
    
    c.line(50, 620, 550, 620)
    
    c.setFont("Helvetica", 12)
    c.drawString(50, 600, product_name)
    c.drawString(450, 600, f"Rs. {price}")
    
    c.line(50, 580, 550, 580)
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(350, 550, "Total Paid:")
    c.drawString(450, 550, f"Rs. {price}")
    
    c.save()
    packet.seek(0)
    return packet.getvalue()

def get_html_template(student_name, phone, product_name, secure_download_url, price, email):
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
        .header {{ background-color: #7c4dff; color: #ffffff; padding: 30px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 24px; }}
        .header p {{ margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }}
        .content {{ padding: 30px; }}
        .password-box {{ background-color: #fff0f5; border-left: 4px solid #e91e63; padding: 15px; margin-bottom: 25px; border-radius: 4px; }}
        .password-box h3 {{ color: #e91e63; margin: 0 0 5px 0; font-size: 16px; }}
        .password-box p {{ margin: 0; color: #333333; }}
        .password-box span {{ font-weight: bold; color: #e91e63; font-size: 18px; }}
        .downloads-section {{ margin-bottom: 25px; }}
        .downloads-title {{ font-size: 18px; color: #7c4dff; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; }}
        .product-row {{ display: flex; align-items: center; justify-content: space-between; padding: 15px; background-color: #fcfcfc; border: 1px solid #eeeeee; border-radius: 6px; }}
        .product-info {{ flex: 1; }}
        .product-name {{ font-weight: bold; color: #333333; margin: 0 0 5px 0; }}
        .btn {{ display: inline-block; background-color: #7c4dff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; font-size: 14px; text-align: center; }}
        .discount-banner {{ background-color: #fff9c4; border: 1px dashed #fbc02d; padding: 20px; text-align: center; border-radius: 6px; margin-bottom: 25px; }}
        .discount-banner h4 {{ margin: 0 0 10px 0; color: #f57f17; }}
        .discount-banner .code {{ display: inline-block; background-color: #ffffff; padding: 8px 15px; border-radius: 4px; font-weight: bold; color: #e65100; letter-spacing: 2px; font-size: 18px; border: 1px solid #fbc02d; }}
        .summary-table {{ width: 100%; border-collapse: collapse; margin-bottom: 25px; }}
        .summary-table th {{ background-color: #f9f9f9; text-align: left; padding: 12px; color: #666666; font-size: 14px; border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; }}
        .summary-table td {{ padding: 12px; color: #333333; font-size: 14px; border-bottom: 1px solid #eeeeee; }}
        .summary-table .total-row td {{ font-weight: bold; color: #7c4dff; }}
        .billing-info {{ font-size: 14px; color: #666666; line-height: 1.5; background-color: #fcfcfc; padding: 15px; border-radius: 6px; border: 1px solid #eeeeee; }}
        .billing-info strong {{ color: #333333; display: block; margin-bottom: 10px; font-size: 16px; }}
        .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #999999; }}
    </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Thanks, Action Taker!</h1>
                <p>Your notes are ready to download</p>
            </div>
            
            <div class="content">
                <div class="password-box">
                    <h3>Hi {student_name},</h3>
                    <p>Your PDF Password = <span>{phone}</span></p>
                    <p style="font-size: 12px; margin-top: 5px; color: #666;">Use your registered mobile number to unlock your notes.</p>
                </div>
                
                <div class="downloads-section">
                    <h3 class="downloads-title">Your Downloads</h3>
                    <div class="product-row">
                        <div class="product-info">
                            <p class="product-name">{product_name}</p>
                            <p style="font-size: 12px; color: #888; margin: 0;">Digital Handwritten Notes</p>
                        </div>
                        <div>
                            <a href="{secure_download_url}" class="btn">Download</a>
                        </div>
                    </div>
                    <p style="font-size: 11px; color: #999; text-align: right; margin-top: 5px;">Download link expires in 7 days. Save your files immediately!</p>
                </div>
                
                <div class="discount-banner">
                    <h4>Exclusive Discount for You!</h4>
                    <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">Get 30% OFF on your next Combo purchase</p>
                    <div class="code">WELCOME30</div>
                    <p style="font-size: 11px; color: #999; margin: 10px 0 0 0;">Applicable for all Notes packs only</p>
                </div>
                
                <h3 class="downloads-title">Order Summary</h3>
                <table class="summary-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{product_name}</td>
                            <td>1</td>
                            <td>Rs. {price}</td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="2" style="text-align: right;">Total Paid :</td>
                            <td>Rs. {price}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="billing-info">
                    <strong>Billing Address</strong>
                    {student_name}<br>
                    Phone: {phone}<br>
                    Email: {email}
                </div>
            </div>
            
            <div class="footer">
                Need help? Reply to this email or WhatsApp us.<br>
                Exam Essentials
            </div>
        </div>
    </body>
    </html>
    """

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
    product_name = data.get("product_name", "Study Notes")
    price = data.get("price", "Free")

    if not pdf_url:
        raise HTTPException(status_code=400, detail="Missing pdf_url")

    try:
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

        # 1. Download source PDF using secure Bearer authentication
        headers = {"Authorization": f"Bearer {supabase_key}"} if supabase_key else {}
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
            # Aggressively hunt for the Resend API Key in case of spelling typos
            active_key = None
            for key, val in os.environ.items():
                if "RESEND" in key.upper().strip():
                    active_key = val.strip()
                    break
            
            if not active_key:
                found_keys = [k for k in os.environ.keys() if "RESEND" in k.upper()]
                raise Exception(f"Missing API Key in environment. Keys it sees: {found_keys}")
                
            resend.api_key = active_key
            
            secure_download_url = pdf_url  # Fallback to direct url
            
            # Step A: Upload encrypted PDF to purchased_pdfs and get Signed URL
            if supabase:
                try:
                    safe_phone = phone if phone else "000"
                    upload_filename = f"{order_id}_{safe_phone}.pdf"
                    
                    # Try uploading; ignore if exists (handle duplicate webhooks gracefully)
                    try:
                        supabase.storage.from_("purchased_pdfs").upload(
                            path=upload_filename,
                            file=processed_data,
                            file_options={"content-type": "application/pdf"}
                        )
                    except Exception:
                        pass
                        
                    # Create Signed URL for 7 days (604800 seconds)
                    signed_response = supabase.storage.from_("purchased_pdfs").create_signed_url(
                        path=upload_filename,
                        expires_in=604800
                    )
                    secure_download_url = signed_response.get("signedURL")
                except Exception as upload_err:
                    print(f"Supabase upload failed: {upload_err}")
            
            # Step B: Generate Invoice PDF
            invoice_pdf = create_invoice_pdf(order_id, student_name, email, phone, product_name, price)
            invoice_attachment = base64.b64encode(invoice_pdf).decode()
            
            # Step C: Compose rich HTML
            html_content = get_html_template(student_name, phone, product_name, secure_download_url, price, email)
            
            resend.Emails.send({
                "from": "Exam Essentials <notes@examessentials.in>",
                "to": email,
                "subject": f"Your Study Material is Ready! - Order #{order_id}",
                "html": html_content,
                "attachments": [
                    {
                        "content": invoice_attachment,
                        "filename": f"Invoice_INV-{order_id}.pdf"
                    }
                ]
            })
            return {"status": "success", "message": f"PDF processed securely and emailed to {email}"}

        # Return PDF binary if no email provided
        return Response(content=processed_data, media_type="application/pdf")

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
