import re
with open("main.py", "r") as f:
    code = f.read()

new_imports = """from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors"""

new_invoice_func = """
def create_invoice_pdf(order_id, student_name, email, phone, product_name, price):
    packet = io.BytesIO()
    doc = SimpleDocTemplate(packet, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    elements = []
    
    styles = getSampleStyleSheet()
    
    # 1. Header (Logo / Title)
    logo_path = "public/logo.png"
    if not os.path.exists(logo_path):
        logo_path = "src/assets/logo.png" # Fallback if running from src
        
    logo_element = None
    if os.path.exists(logo_path):
        # Determine aspect ratio roughly
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
    data = [
        ["Product", "Qty", "Price", "Total"],
        [Paragraph(product_name, styles['Normal']), "1", f"Rs. {price}", f"Rs. {price}"]
    ]
    
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
    
    # 4. Total Table
    total_data = [
        ["Subtotal:", f"Rs. {price}"],
        ["Total Paid:", f"Rs. {price}"]
    ]
    total_table = Table(total_data, colWidths=[430, 100])
    total_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 1), (-1, 1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 1), (-1, 1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(total_table)
    
    # 5. Build
    doc.build(elements)
    
    return packet.getvalue()
"""

# Replace old imports
code = code.replace("from reportlab.pdfgen import canvas\nfrom reportlab.lib.pagesizes import letter", new_imports)

# We need to replace the old generate_invoice
import re
code = re.sub(r'def create_invoice_pdf\(.*?\):.*?return packet\.getvalue\(\)', new_invoice_func, code, flags=re.DOTALL)

with open("main.py", "w") as f:
    f.write(code)

