import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Privacy Policy - Exam Essentials</title>
        <meta name="description" content="Privacy Policy for Exam Essentials - Learn how we collect, use, and protect your personal information." />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p className="text-sm text-muted-foreground">Last updated: December 28, 2025</p>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
            <p>
              Welcome to Exam Essentials. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, and class/grade level when you make a purchase.</li>
              <li><strong>Payment Information:</strong> Payment details are processed securely through Razorpay and are not stored on our servers.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website, including pages visited and time spent.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process your orders and deliver digital products (study notes)</li>
              <li>Send order confirmations and important updates</li>
              <li>Provide customer support</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. 
              All payment transactions are encrypted and processed through Razorpay's secure payment gateway.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Third-Party Services</h2>
            <p>
              We use third-party services such as Razorpay for payment processing. 
              These services have their own privacy policies governing the use of your information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:examessentials4@gmail.com" className="text-primary hover:underline">examessentials4@gmail.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
