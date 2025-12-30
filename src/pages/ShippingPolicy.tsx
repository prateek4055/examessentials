import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Shipping Policy - Exam Essentials</title>
        <meta name="description" content="Shipping Policy for Exam Essentials - Learn about our digital product delivery process." />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Shipping Policy</h1>
        
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p className="text-sm text-muted-foreground">Last updated: December 28, 2025</p>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Digital Products Only</h2>
            <p>
              Exam Essentials exclusively sells digital products. We do not sell or ship any physical products. 
              All our study materials are provided in digital format (PDF) and are delivered electronically.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Delivery Method</h2>
            <p>
              Upon successful payment, your purchased digital products will be delivered via:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Email Delivery:</strong> A download link will be sent to the email address provided during purchase.</li>
              <li><strong>Instant Access:</strong> Products are available for download immediately after payment confirmation.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. Delivery Timeline</h2>
            <p>
              Digital products are delivered instantly. You should receive your download link within:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Immediate:</strong> Most orders are delivered within seconds of payment confirmation.</li>
              <li><strong>Maximum:</strong> In rare cases, delivery may take up to 15 minutes due to email server delays.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Delivery Issues</h2>
            <p>
              If you haven't received your product within 24 hours of purchase:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Check your spam/junk email folder.</li>
              <li>Verify that you provided the correct email address during purchase.</li>
              <li>Contact us at <a href="mailto:examessentials.info@gmail.com" className="text-primary hover:underline">examessentials.info@gmail.com</a> with your order details.</li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. No Physical Shipping</h2>
            <p>
              Since all our products are digital:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>No physical address is required for delivery.</li>
              <li>No shipping charges apply.</li>
              <li>Products are available worldwide with no geographic restrictions.</li>
              <li>No waiting time for physical delivery.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Contact Us</h2>
            <p>
              For any questions regarding product delivery, please contact us:
            </p>
            <p>
              Email: <a href="mailto:examessentials.info@gmail.com" className="text-primary hover:underline">examessentials.info@gmail.com</a><br />
              WhatsApp: <a href="https://wa.me/919460970342" className="text-primary hover:underline">+91 94609 70342</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;
