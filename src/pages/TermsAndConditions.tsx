import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Terms and Conditions - Exam Essentials</title>
        <meta name="description" content="Terms and Conditions for Exam Essentials - Read our terms of service for using our platform and purchasing study materials." />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p className="text-sm text-muted-foreground">Last updated: December 28, 2025</p>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Exam Essentials website and purchasing our products, you agree to be bound by these Terms and Conditions. 
              If you do not agree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Products and Services</h2>
            <p>
              Exam Essentials provides digital study materials, including handwritten notes for Class 11 and Class 12 students 
              covering subjects such as Physics, Chemistry, Mathematics, and Biology.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All products are digital downloads in PDF format</li>
              <li>Products are delivered via email after successful payment</li>
              <li>Product descriptions and samples are provided for reference before purchase</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
            <p>
              You may create an account to access our services. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and current information</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Intellectual Property</h2>
            <p>
              All content on this website, including study materials, notes, images, and text, are the intellectual property of Exam Essentials. 
              You are granted a personal, non-transferable license to use purchased materials for your own educational purposes only.
            </p>
            <p><strong>You may not:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reproduce, distribute, or share purchased materials</li>
              <li>Resell or commercially exploit our products</li>
              <li>Remove any copyright notices from our materials</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Payment Terms</h2>
            <p>
              All payments are processed securely through Razorpay. Prices are displayed in Indian Rupees (INR). 
              By making a purchase, you agree to pay the listed price plus any applicable taxes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
            <p>
              Exam Essentials is not liable for any indirect, incidental, or consequential damages arising from the use of our products or services. 
              Our total liability shall not exceed the amount paid for the purchased product.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website. 
              Continued use of our services constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">8. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">9. Contact Information</h2>
            <p>
              For any questions regarding these Terms and Conditions, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:examessentials.info@gmail.com" className="text-primary hover:underline">examessentials.info@gmail.com</a><br />
              Phone: <a href="tel:+919460970342" className="text-primary hover:underline">+91 94609 70342</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
