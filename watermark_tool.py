import os
import sys
import io
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas

def get_clean_password(phone: str) -> str:
    # Remove all non-numeric characters
    numeric_phone = ''.join(filter(str.isdigit, str(phone)))
    # If it's longer than 10 digits (e.g. +91 prefix), take the last 10
    if len(numeric_phone) > 10:
        return numeric_phone[-10:]
    return numeric_phone

def watermark_and_encrypt(input_pdf_path: str, student_name: str, phone: str, output_pdf_path: str = None):
    # Expand ~ user paths if entered
    input_pdf_path = os.path.expanduser(input_pdf_path.strip().replace("'", "").replace('"', ''))
    
    if not os.path.exists(input_pdf_path):
        print(f"\n❌ Error: Input PDF file not found at '{input_pdf_path}'")
        return False

    if not output_pdf_path:
        base, ext = os.path.splitext(input_pdf_path)
        output_pdf_path = f"{base}_protected{ext}"
    else:
        output_pdf_path = os.path.expanduser(output_pdf_path.strip().replace("'", "").replace('"', ''))

    print("\n" + "="*50)
    print(f"📄 Processing: {input_pdf_path}")
    print(f"👤 Student: {student_name}")
    print(f"📞 Phone: {phone}")
    
    clean_password = get_clean_password(phone)
    if clean_password:
        print(f"🔒 PDF Password will be: {clean_password}")
    else:
        print("⚠️ Warning: No valid phone number provided. PDF will not be password protected!")

    try:
        reader = PdfReader(input_pdf_path)
        writer = PdfWriter()
        
        watermark_text = f"Licensed to: {student_name} ({phone})"
        total_pages = len(reader.pages)
        print(f"📚 Total pages to process: {total_pages}")
        
        for idx, page in enumerate(reader.pages):
            width = float(page.mediabox.width)
            height = float(page.mediabox.height)
            
            # Create watermark layer
            packet = io.BytesIO()
            can = canvas.Canvas(packet, pagesize=(width, height))
            
            # Dynamic font size based on page width
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
            
            if (idx + 1) % 50 == 0 or (idx + 1) == total_pages:
                print(f"⏳ Processed {idx + 1}/{total_pages} pages...")

        # Apply encryption
        if clean_password:
            import secrets
            owner_pwd = secrets.token_hex(16)
            writer.encrypt(
                user_password=clean_password,
                owner_password=owner_pwd,
                permissions_flag=0  # Restricts copying/extracting content
            )
            print("🔒 Encryption applied successfully.")

        # Save to output file
        with open(output_pdf_path, 'wb') as out_file:
            writer.write(out_file)
            
        print("="*50)
        print(f"🎉 Success! Saved watermarked & protected PDF to:\n👉 {os.path.abspath(output_pdf_path)}\n")
        return True

    except Exception as e:
        print(f"❌ Error during PDF processing: {e}")
        return False

def main():
    print("=== Interactive PDF Watermarking & Password Protection Tool ===")
    
    # Prompt for user inputs
    input_path = input("Enter the path to the PDF file (e.g. /path/to/pdf.pdf): ").strip()
    if not input_path:
        print("Error: Input path cannot be empty.")
        return
        
    student_name = input("Enter the Student's Name: ").strip()
    if not student_name:
        print("Error: Student Name cannot be empty.")
        return
        
    phone = input("Enter the Student's Phone Number: ").strip()
    if not phone:
        print("Error: Phone Number cannot be empty.")
        return
        
    watermark_and_encrypt(input_path, student_name, phone)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nOperation cancelled.")
