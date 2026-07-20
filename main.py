import os
import io
import requests
import resend
import base64
import json
import jwt
from datetime import datetime, timedelta, timezone

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

# GitHub configuration for private PDF storage
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = os.getenv("GITHUB_REPO")  # e.g., "prateek4055/examessentials-pdfs"
DOWNLOAD_BASE_URL = os.getenv("DOWNLOAD_BASE_URL", "https://pdf-workerdf-workerpdf.onrender.com")


# Cloudflare R2 Credentials
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME")

r2_client = None
if R2_ACCOUNT_ID and R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY:
    try:
        import boto3
        from botocore.config import Config
        r2_client = boto3.client(
            "s3",
            endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY,
            config=Config(signature_version="s3v4"),
            region_name="auto"
        )
        print("[R2] Cloudflare R2 client initialized successfully.")
    except Exception as e:
        print(f"[R2] Failed to initialize Cloudflare R2 client: {e}")

def upload_to_r2(data: bytes, object_key: str, content_type: str = "application/pdf") -> bool:
    if not r2_client or not R2_BUCKET_NAME:
        print("[R2] Client or bucket name not configured.")
        return False
    try:
        r2_client.put_object(
            Bucket=R2_BUCKET_NAME,
            Key=object_key,
            Body=data,
            ContentType=content_type
        )
        return True
    except Exception as e:
        print(f"[R2] Error uploading to R2: {e}")
        return False

def get_r2_presigned_url(object_key: str, expires_in: int = 604800) -> str:
    if not r2_client or not R2_BUCKET_NAME:
        return None
    try:
        url = r2_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": R2_BUCKET_NAME, "Key": object_key},
            ExpiresIn=expires_in
        )
        return url
    except Exception as e:
        print(f"[R2] Error generating presigned URL: {e}")
        return None

def download_github_release_asset(repo: str, token: str, filename: str) -> bytes:
    tag = "v1.0.0"
    # 1. Fetch release info to get asset list
    release_url = f"https://api.github.com/repos/{repo}/releases/tags/{tag}"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    resp = requests.get(release_url, headers=headers)
    if resp.status_code != 200:
        print(f"[GitHub] Failed to get release info: {resp.status_code} {resp.text[:200]}")
        return None
        
    release_data = resp.json()
    assets = release_data.get("assets", [])
    
    # 2. Find matching asset by name
    asset_id = None
    for asset in assets:
        if asset.get("name") == filename:
            asset_id = asset.get("id")
            break
            
    if not asset_id:
        print(f"[GitHub] Asset not found in release: {filename}")
        return None
        
    # 3. Download the asset using octet-stream
    asset_url = f"https://api.github.com/repos/{repo}/releases/assets/{asset_id}"
    download_headers = {
        "Authorization": f"token {token}",
        "Accept": "application/octet-stream"
    }
    
    download_resp = requests.get(asset_url, headers=download_headers)
    if download_resp.status_code != 200:
        print(f"[GitHub] Failed to download asset {asset_id}: {download_resp.status_code} {download_resp.text[:200]}")
        return None
        
    return download_resp.content



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

def get_clean_password(phone: str) -> str:
    # Remove all non-numeric characters
    numeric_phone = ''.join(filter(str.isdigit, str(phone)))
    # If it's longer than 10 digits (usually +91 prefix), take last 10
    if len(numeric_phone) > 10:
        return numeric_phone[-10:]
    return numeric_phone

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

def get_html_template(student_name, phone, products, email, total_amount, clean_password, coupon_code="WELCOME15", first_name="Student"):
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
                    <p>Your PDF Password = <span>{clean_password}</span></p>
                    <p style="font-size: 12px; margin-top: 5px; color: #666;">Use these 10 digits to unlock your notes.</p>
                </div>
                
                <div class="downloads-section">
                    <h3 class="downloads-title">Your Downloads</h3>
                    {product_rows}
                    <p style="font-size: 11px; color: #999; text-align: right; margin-top: 5px;">Download link expires in 7 days. Save your files immediately!</p>
                </div>
                
                <div class="discount-banner">
                    <h4>Exclusive Discount for You, {first_name}!</h4>
                    <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">Get 15% OFF on your next purchase</p>
                    <div class="code">{coupon_code}</div>
                    <p style="font-size: 11px; color: #999; margin: 10px 0 0 0;">Use this code at checkout on your next purchase</p>
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
    payment_id = data.get("payment_id", "")
    
    clean_password = get_clean_password(phone)

    # Debug string to capture what goes wrong with URLs
    debug_log = []

    
    # Check for custom/combo prices from Admin
    custom_prices = {}
    if payment_id and isinstance(payment_id, str) and payment_id.startswith("admin_custom_"):
        try:
            json_str = payment_id.replace("admin_custom_", "")
            custom_prices = json.loads(json_str)
        except Exception as pe:
            print(f"Failed to parse custom prices: {pe}")

    if not products_input:
        raise HTTPException(status_code=400, detail="Missing products array")

    try:
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

        # Generate personalized coupon code (e.g. PRATEEK15)
        coupon_code = "WELCOME15"
        first_name = "Student"
        if student_name:
            import re
            parts = student_name.strip().split()
            if parts:
                name_part = re.sub(r'[^A-Za-z]', '', parts[0])
                if name_part:
                    first_name = name_part.upper()
            coupon_code = f"{first_name}15"
            
            if supabase:
                try:
                    supabase.table("coupons").upsert({"code": coupon_code, "discount_percent": 15}).execute()
                    print(f"[DEBUG] Coupon {coupon_code} upserted successfully via python client")
                except Exception as db_err:
                    print(f"[DEBUG] Failed to upsert coupon {coupon_code}: {db_err}")

        processed_products = []

        for p in products_input:
            p_id = p.get("id")
            p_pdf_url = p.get("pdf_url")
            if not p_pdf_url:
                continue

            # Override price if provided in custom mapping (for combos/admin custom prices)
            # Use string ID for mapping lookup
            p_price = custom_prices.get(str(p_id), p.get("price"))            # If GITHUB_TOKEN is set, we bypass heavy on-the-spot processing/uploading
            # and instead generate a signed JWT link for secure on-the-fly streaming download.
            secure_download_url = p_pdf_url  # Fallback
            use_github_streaming = False

            if GITHUB_TOKEN and GITHUB_REPO:
                try:
                    exp_time = datetime.now(timezone.utc) + timedelta(days=7)
                    token_payload = {
                        "student_name": student_name,
                        "phone": phone,
                        "pdf_url": p_pdf_url,
                        "title": p.get("title", "Study Material"),
                        "exp": int(exp_time.timestamp())
                    }
                    token_str = jwt.encode(token_payload, WORKER_SECRET, algorithm="HS256")
                    secure_download_url = f"{DOWNLOAD_BASE_URL.rstrip('/')}/download?token={token_str}"
                    use_github_streaming = True
                    debug_log.append("GitHub Streaming Link: SUCCESS")
                except Exception as jwt_err:
                    print(f"Failed to generate JWT: {jwt_err}")
                    debug_log.append(f"JWT Exception: {str(jwt_err)}")

            if not use_github_streaming:
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

                # 2. & 3. Create and Apply dynamic centered watermark
                watermark_text = f"Licensed to: {student_name} ({phone})"
                
                for page in reader.pages:
                    width = float(page.mediabox.width)
                    height = float(page.mediabox.height)
                    
                    packet = io.BytesIO()
                    can = canvas.Canvas(packet, pagesize=(width, height))
                    
                    # Dynamic font size: much smaller than before, scales nicely
                    font_size = min(24, max(10, int(width / 25)))
                    
                    can.setFont("Helvetica-Bold", font_size)
                    can.setFillGray(0.5, 0.4)
                    
                    can.saveState()
                    # Translate origin to exact center of the current page
                    can.translate(width / 2.0, height / 2.0)
                    can.rotate(45)
                    can.drawCentredString(0, 0, watermark_text)
                    can.restoreState()
                    can.save()
                    
                    packet.seek(0)
                    watermark_reader = PdfReader(packet)
                    watermark_page = watermark_reader.pages[0]
                    
                    page.merge_page(watermark_page)
                    writer.add_page(page)

                # 4. Password Protection
                if clean_password:
                    writer.encrypt(
                        user_password=clean_password,
                        owner_password=os.urandom(16).hex(),
                        permissions_flag=0
                    )

                output_buffer = io.BytesIO()
                writer.write(output_buffer)
                processed_data = output_buffer.getvalue()

                # 5. Upload to Cloudflare R2 (preferred) or fallback to Supabase Storage
                uploaded_to_r2 = False
                if r2_client and R2_BUCKET_NAME:
                    try:
                        safe_phone = clean_password if clean_password else "000"
                        upload_filename = f"orders/{order_id}/{p.get('id')}_{safe_phone}.pdf"
                        if upload_to_r2(processed_data, upload_filename, "application/pdf"):
                            r2_url = get_r2_presigned_url(upload_filename, 604800)
                            if r2_url:
                                secure_download_url = r2_url
                                uploaded_to_r2 = True
                                debug_log.append("R2: SUCCESS")
                    except Exception as r2_err:
                        debug_log.append(f"R2 Exception: {str(r2_err)}")

                if not uploaded_to_r2 and supabase_url and supabase_key:
                    try:
                        safe_phone = clean_password if clean_password else "000"
                        upload_filename = f"orders/{order_id}/{p.get('id')}_{safe_phone}.pdf"
                        # Correct bucket for processed PDFs is 'purchased_pdfs'
                        upload_url = f"{supabase_url}/storage/v1/object/purchased_pdfs/{upload_filename}"
                        
                        upload_headers = {
                            "Authorization": f"Bearer {supabase_key}",
                            "apikey": supabase_key,
                            "Content-Type": "application/pdf"
                        }
                        
                        upload_resp = requests.post(upload_url, headers=upload_headers, data=processed_data)
                        debug_log.append(f"Upload: {upload_resp.status_code} {upload_resp.text[:50]}")
                            
                        sign_url = f"{supabase_url}/storage/v1/object/sign/purchased_pdfs/{upload_filename}"
                        sign_resp = requests.post(sign_url, headers={
                            "Authorization": f"Bearer {supabase_key}",
                            "apikey": supabase_key,
                            "Content-Type": "application/json"
                        }, json={"expiresIn": 604800})
                        
                        if sign_resp.status_code == 200:
                            signed_data = sign_resp.json()
                            val = signed_data.get("signedURL") or signed_data.get("signedUrl")
                            if val:
                                # Robust URL repair: Ensure /storage/v1/ prefix is present for relative paths
                                if val.startswith("http"):
                                    secure_download_url = val
                                else:
                                    clean_path = val if val.startswith("/") else f"/{val}"
                                    if not clean_path.startswith("/storage/v1/"):
                                        clean_path = f"/storage/v1{clean_path}"
                                    secure_download_url = f"{supabase_url}{clean_path}"
                                
                                debug_log.append("Sign: SUCCESS")
                            else:
                                debug_log.append(f"Sign Payload Error: {signed_data}")

                        else:
                            debug_log.append(f"Sign HTTP Error: {sign_resp.status_code} {sign_resp.text[:50]}")
                    except Exception as upload_err:
                        debug_log.append(f"REST Exception: {str(upload_err)}")


            processed_products.append({
                "title": p.get("title"),
                "price": p_price,
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
            html_content = get_html_template(student_name, phone, processed_products, email, total_amount, clean_password, coupon_code, first_name)
            
            resend.Emails.send({
                "from": "Exam Essentials <contact@examessentials.in>",
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

@app.post("/watermark")
async def watermark_pdf(request: Request):
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

    clean_password = get_clean_password(phone)

    try:
        # Download the original PDF
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        headers = {"Authorization": f"Bearer {supabase_key}"} if supabase_key else {}
        auth_pdf_url = pdf_url
        if supabase_key and "/object/public/" in auth_pdf_url:
            auth_pdf_url = auth_pdf_url.replace("/object/public/", "/object/authenticated/")

        resp = requests.get(auth_pdf_url, headers=headers)
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to download original PDF")

        reader = PdfReader(io.BytesIO(resp.content))
        writer = PdfWriter()

        watermark_text = f"Licensed to: {student_name} ({phone})"

        for page in reader.pages:
            width = float(page.mediabox.width)
            height = float(page.mediabox.height)
            
            packet = io.BytesIO()
            can = canvas.Canvas(packet, pagesize=(width, height))
            
            font_size = min(24, max(10, int(width / 25)))
            
            can.setFont("Helvetica-Bold", font_size)
            can.setFillGray(0.5, 0.4)
            
            can.saveState()
            can.translate(width / 2.0, height / 2.0)
            can.rotate(45)
            can.drawCentredString(0, 0, watermark_text)
            can.restoreState()
            can.save()
            
            packet.seek(0)
            watermark_reader = PdfReader(packet)
            watermark_page = watermark_reader.pages[0]
            
            page.merge_page(watermark_page)
            writer.add_page(page)

        if clean_password:
            writer.encrypt(
                user_password=clean_password,
                owner_password=os.urandom(16).hex(),
                permissions_flag=0
            )

        output_buffer = io.BytesIO()
        writer.write(output_buffer)
        
        return Response(content=output_buffer.getvalue(), media_type="application/pdf")

    except Exception as e:
        print(f"Watermark Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download")
async def download_pdf(token: str):
    if not token:
        raise HTTPException(status_code=400, detail="Missing download token.")

    try:
        # Decode and verify the JWT token
        payload = jwt.decode(token, WORKER_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return Response(content="<h3>Link Expired</h3><p>Your download link has expired (valid for 7 days). Please contact support.</p>", media_type="text/html", status_code=403)
    except jwt.InvalidTokenError:
        return Response(content="<h3>Invalid Link</h3><p>This download link is invalid.</p>", media_type="text/html", status_code=403)

    student_name = payload.get("student_name", "Student")
    phone = payload.get("phone", "")
    pdf_url = payload.get("pdf_url")
    title = payload.get("title", "Notes")

    if not pdf_url:
        raise HTTPException(status_code=400, detail="Invalid token payload: missing pdf_url.")

    # Extract filename only to avoid directory traversal
    pdf_filename = os.path.basename(pdf_url)

    if not GITHUB_TOKEN or not GITHUB_REPO:
        raise HTTPException(status_code=500, detail="GitHub configuration is missing on the server.")

    # Download original PDF from GitHub Private Release Assets
    pdf_content = download_github_release_asset(GITHUB_REPO, GITHUB_TOKEN, pdf_filename)
    if not pdf_content:
        raise HTTPException(status_code=404, detail="Original PDF file not found in the repository release.")


    # Process PDF on local disk to stay well within Render 512MB RAM limit
    import tempfile
    temp_input_fd, temp_input_path = tempfile.mkstemp(suffix=".pdf")
    temp_output_fd, temp_output_path = tempfile.mkstemp(suffix=".pdf")

    try:
        with os.fdopen(temp_input_fd, 'wb') as tmp_in:
            tmp_in.write(pdf_content)


        reader = PdfReader(temp_input_path)
        writer = PdfWriter()
        watermark_text = f"Licensed to: {student_name} ({phone})"
        clean_password = get_clean_password(phone)

        for page in reader.pages:
            width = float(page.mediabox.width)
            height = float(page.mediabox.height)
            
            packet = io.BytesIO()
            can = canvas.Canvas(packet, pagesize=(width, height))
            font_size = min(24, max(10, int(width / 25)))
            can.setFont("Helvetica-Bold", font_size)
            can.setFillGray(0.5, 0.4)
            
            can.saveState()
            can.translate(width / 2.0, height / 2.0)
            can.rotate(45)
            can.drawCentredString(0, 0, watermark_text)
            can.restoreState()
            can.save()
            
            packet.seek(0)
            watermark_reader = PdfReader(packet)
            watermark_page = watermark_reader.pages[0]
            
            page.merge_page(watermark_page)
            writer.add_page(page)

        if clean_password:
            import secrets
            writer.encrypt(
                user_password=clean_password,
                owner_password=secrets.token_hex(16),
                permissions_flag=0
            )

        with os.fdopen(temp_output_fd, 'wb') as tmp_out:
            writer.write(tmp_out)

        with open(temp_output_path, 'rb') as f:
            pdf_bytes = f.read()

    finally:
        # Clean up temp files immediately to free disk space
        try:
            if os.path.exists(temp_input_path):
                os.remove(temp_input_path)
            if os.path.exists(temp_output_path):
                os.remove(temp_output_path)
        except Exception as cleanup_err:
            print(f"Error cleaning up temp files: {cleanup_err}")

    # Generate a download-friendly filename
    safe_filename = "".join(c for c in title if c.isalnum() or c in (" ", "_", "-")).strip() or "Notes"
    safe_filename = safe_filename.replace(" ", "_") + ".pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{safe_filename}"'
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
