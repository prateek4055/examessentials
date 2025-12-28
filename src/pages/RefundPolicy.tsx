import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Cancellation and Refund Policy - Exam Essentials</title>
        <meta name="description" content="Cancellation and Refund Policy for Exam Essentials - Learn about our refund policy for digital study materials." />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Cancellation and Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p className="text-sm text-muted-foreground">Last updated: December 28, 2025</p>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Digital Product Nature</h2>
            <p>
              Exam Essentials sells digital products (PDF study notes) that are delivered electronically immediately after purchase. 
              Due to the nature of digital products, we have specific policies regarding cancellations and refunds.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Cancellation Policy</h2>
            <p>
              Since our products are digital and delivered instantly upon payment confirmation, 
              orders cannot be cancelled once the payment has been processed successfully.
            </p>
            <p>
              If you wish to cancel an order before completing the payment, simply close the payment window 
              and no charges will be made to your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. Refund Policy</h2>
            <p>
              We offer refunds in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Technical Issues:</strong> If you are unable to download or access the purchased material due to technical issues on our end.</li>
              <li><strong>Wrong Product:</strong> If you received a different product than what you ordered.</li>
              <li><strong>Duplicate Payment:</strong> If you were charged multiple times for the same order.</li>
              <li><strong>Non-Delivery:</strong> If you did not receive the product within 24 hours of successful payment.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Refund Request Process</h2>
            <p>
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Email us at <a href="mailto:examessentials4@gmail.com" className="text-primary hover:underline">examessentials4@gmail.com</a> within 7 days of purchase.</li>
              <li>Include your order details: Order ID, email used for purchase, and product name.</li>
              <li>Describe the issue you encountered.</li>
              <li>Attach any relevant screenshots if applicable.</li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Refund Timeline</h2>
            <p>
              Once your refund request is approved:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Refunds will be processed within 5-7 business days.</li>
              <li>The refund will be credited to the original payment method used during purchase.</li>
              <li>Bank processing times may vary; please allow additional time for the amount to reflect in your account.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Non-Refundable Cases</h2>
            <p>
              Refunds will NOT be provided in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Change of mind after purchase and successful download.</li>
              <li>Inability to use the product due to your device compatibility issues.</li>
              <li>Requests made after 7 days of purchase.</li>
              <li>If the product has been successfully downloaded and accessed.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. Contact Us</h2>
            <p>
              For any questions regarding our Cancellation and Refund Policy, please contact us:
            </p>
            <p>
              Email: <a href="mailto:examessentials4@gmail.com" className="text-primary hover:underline">examessentials4@gmail.com</a><br />
              WhatsApp: <a href="https://wa.me/919818546306" className="text-primary hover:underline">+91 98185 46306</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
