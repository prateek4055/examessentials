import os
import io
import requests
import resend
import base64
import json
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
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

def create_invoice_pdf(order_id, student_name, email, phone, products, total_amount):
    packet = io.BytesIO()
    doc = SimpleDocTemplate(packet, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    elements = []
    
    styles = getSampleStyleSheet()
    
    # 1. Header (Logo / Title)
    logo_path = "public/logo.png"
    if not os.path.exists(logo_path):
        logo_path = "src/assets/logo.png"
        
    logo_element = None
    if os.path.exists(logo_path):
        try:
            from PIL import Image as PILImage
            with PILImage.open(logo_path) as im:
                w, h = im.size
                asp = w / h
                logo_element = Image(logo_path, width=50 * asp, height=50)
                logo_element.hAlign = 'LEFT'
        except Exception:
            logo_element = Image(logo_path, width=150, height=40)
            logo_element.hAlign = 'LEFT'

    header_table_data = [
        [logo_element if logo_element else Paragraph("<b>Exam Essentials</b>", styles['Heading1']), 
         Paragraph(f"<font size=14><b>INVOICE</b></font><br/><br/>Order ID: #{order_id}", styles['Normal'])]
    ]
    t = Table(header_table_data, colWidths=[300, 200])
    t.setStyle(TableStyle([
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP')
    ]))
    elements.append(t)
    elements.append(Spacer(1, 30))
    
    # 2. Billing details
    elements.append(Paragraph("<b>Billed To:</b>", styles['Heading3']))
    billing_info = f"{student_name}<br/>{phone}<br/>{email}"
    elements.append(Paragraph(billing_info, styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # 3. Items Table
    data = [["Product", "Qty", "Price", "Total"]]
    for p in products:
        data.append([Paragraph(p['title'], styles['Normal']), "1", f"Rs. {p['price']}", f"Rs. {p['price']}"])
    
    table = Table(data, colWidths=[280, 50, 100, 100])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f7f7f7')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 10),
        ('LINEBELOW', (0, 0), (-1, 0), 1, colors.HexColor('#dddddd')),
        ('LINEBELOW', (0, -1), (-1, -1), 1, colors.HexColor('#dddddd')),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 20))
    
    # 4. Total Table with GST
    subtotal = float(total_amount) / 1.05
    gst_amount = float(total_amount) - subtotal
    
    total_data = [
        ["Subtotal:", f"Rs. {subtotal:.2f}"],
        ["GST (5%):", f"Rs. {gst_amount:.2f}"],
        ["Total Paid (Inclusive of GST):", f"Rs. {float(total_amount):.2f}"]
    ]
    total_table = Table(total_data, colWidths=[380, 150])
    total_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 2), (-1, 2), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 2), (-1, 2), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(total_table)
    
    # 5. Build
    doc.build(elements)
    
    return packet.getvalue()

def get_html_template(student_name, phone, products, email, total_amount):
    # Calculate GST
    subtotal = float(total_amount) / 1.05
    gst_amount = float(total_amount) - subtotal

    product_rows = ""
    for p in products:
        img_tag = f'<img src="{p["image_url"]}" alt="{p["title"]}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 15px;" />' if p.get('image_url') else ""
        product_rows += f"""
        <div class="product-row" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background-color: #fcfcfc; border: 1px solid #eeeeee; border-radius: 6px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
                {img_tag}
                <div class="product-info">
                    <p class="product-name" style="font-weight: bold; color: #333333; margin: 0 0 5px 0;">{p['title']}</p>
                    <p style="font-size: 12px; color: #888; margin: 0;">Digital Handwritten Notes</p>
                </div>
            </div>
            <div>
                <a href="{p['secure_download_url']}" class="btn" style="display: inline-block; background-color: #7c4dff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; font-size: 14px; text-align: center;">Download</a>
            </div>
        </div>
        """

    summary_rows = ""
    for p in products:
        summary_rows += f"""
        <tr>
            <td style="padding: 12px; color: #333333; font-size: 14px; border-bottom: 1px solid #eeeeee;">{p['title']}</td>
            <td style="padding: 12px; color: #333333; font-size: 14px; border-bottom: 1px solid #eeeeee; text-align: right;">1</td>
            <td style="padding: 12px; color: #333333; font-size: 14px; border-bottom: 1px solid #eeeeee; text-align: right;">Rs. {p['price']}</td>
        </tr>
        """

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
                <img src="https://examessentials.in/logo.png" alt="Exam Essentials" style="max-height: 40px; margin-bottom: 20px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.2));" />
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
                    {product_rows}
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
                            <th style="padding: 12px; text-align: left; background-color: #f9f9f9;">Product</th>
                            <th style="padding: 12px; text-align: right; background-color: #f9f9f9;">Qty</th>
                            <th style="padding: 12px; text-align: right; background-color: #f9f9f9;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summary_rows}
                        <tr>
                            <td colspan="2" style="padding: 12px; text-align: right; color: #666; font-size: 14px;">GST (5%):</td>
                            <td style="padding: 12px; text-align: right; color: #333; font-size: 14px;">Rs. {gst_amount:.2f}</td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold; color: #7c4dff;">Total Paid :</td>
                            <td style="padding: 12px; text-align: right; font-weight: bold; color: #7c4dff;">Rs. {float(total_amount):.2f}</td>
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

    products_input = data.get("products", [])
    student_name = data.get("student_name", "Student")
    phone = data.get("phone", "")
    email = data.get("email")
    order_id = data.get("order_id", "N/A")
    total_amount = data.get("total_amount", 0)

    if not products_input:
        raise HTTPException(status_code=400, detail="Missing products array")

    try:
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

        processed_products = []

        for p in products_input:
            p_pdf_url = p.get("pdf_url")
            if not p_pdf_url:
                continue

            # 1. Download source PDF using secure Bearer authentication
            headers = {"Authorization": f"Bearer {supabase_key}"} if supabase_key else {}
            # Ensure URL uses authenticated endpoint if bucket is private
            auth_pdf_url = p_pdf_url
            if supabase_key and "/object/public/" in auth_pdf_url:
                auth_pdf_url = auth_pdf_url.replace("/object/public/", "/object/authenticated/")

            resp = requests.get(auth_pdf_url, headers=headers)
            if resp.status_code != 200:
                print(f"Failed to download PDF for {p.get('title')}: {resp.status_code}")
                continue

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

            secure_download_url = p_pdf_url # Fallback
            
            # 5. Upload to Supabase Storage
            if supabase:
                try:
                    safe_phone = phone if phone else "000"
                    # Generate a unique path: order_id/product_id_phone.pdf
                    upload_filename = f"{order_id}/{p.get('id')}_{safe_phone}.pdf"
                    
                    try:
                        supabase.storage.from_("purchased_pdfs").upload(
                            path=upload_filename,
                            file=processed_data,
                            file_options={"content-type": "application/pdf"}
                        )
                    except Exception as e:
                        print(f"Upload error (likely already exists): {e}")
                        
                    # Create Signed URL for 7 days
                    signed_response = supabase.storage.from_("purchased_pdfs").create_signed_url(
                        path=upload_filename,
                        expires_in=604800
                    )
                    secure_download_url = signed_response.get("signedURL") or p_pdf_url
                except Exception as upload_err:
                    print(f"Supabase storage operations failed: {upload_err}")

            processed_products.append({
                "title": p.get("title"),
                "price": p.get("price"),
                "image_url": p.get("image_url"),
                "secure_download_url": secure_download_url
            })

        # 6. Send Email if requested
        if email and processed_products:
            # Refresh key
            active_key = None
            for key, val in os.environ.items():
                if "RESEND" in key.upper().strip():
                    active_key = val.strip()
                    break
            
            if not active_key:
                raise Exception("Missing RESEND API Key")
                
            resend.api_key = active_key
            
            # Generate Invoice PDF
            invoice_pdf = create_invoice_pdf(order_id, student_name, email, phone, processed_products, total_amount)
            invoice_attachment = base64.b64encode(invoice_pdf).decode()
            
            # Compose HTML
            html_content = get_html_template(student_name, phone, processed_products, email, total_amount)
            
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
            return {"status": "success", "message": f"Processed {len(processed_products)} items and emailed to {email}"}

        return {"status": "success", "message": "No individual PDF returned for direct download in multi-mode."}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
