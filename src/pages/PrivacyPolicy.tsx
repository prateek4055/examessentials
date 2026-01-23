import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Privacy Policy"
        description="Privacy Policy for Exam Essentials - Learn how we collect, use, and protect your personal information when using our study materials platform and mobile applications including MedOrtho."
        canonical="/privacy-policy"
        keywords="privacy policy, data protection, personal information, exam essentials privacy, medortho privacy"
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p className="text-sm text-muted-foreground">Last updated: January 23, 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
            <p>
              Welcome to Exam Essentials. Exam Essentials ("we", "our", "us") operates the Exam Essentials platform, website, and mobile applications including <strong>MedOrtho</strong> and other apps under our ecosystem.
            </p>
            <p>
              We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <p className="font-medium text-foreground">Scope of This Policy</p>
              <p className="mt-2">
                This policy applies to all Exam Essentials apps including <strong>MedOrtho</strong> and any future apps launched under Exam Essentials (such as MedNeuro, MedPhysio, MedCardio, etc.).
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, and class/grade level when you make a purchase or create an account.</li>
              <li><strong>Authentication Data:</strong> When using our apps, we may collect your name, email, and profile photo (optional) through Google Sign-In or other authentication methods.</li>
              <li><strong>Payment Information:</strong> Payment details are processed securely through Razorpay and are not stored on our servers.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website and apps, including pages visited, features used, and time spent.</li>
              <li><strong>Device Information:</strong> Device type, operating system, and unique device identifiers when using our mobile applications.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process your orders and deliver digital products (study notes)</li>
              <li>Provide access to app features and content</li>
              <li>Send order confirmations and important updates</li>
              <li>Provide customer support</li>
              <li>Improve our website, apps, and services</li>
              <li>Personalize your experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Authentication & Login</h2>
            <p>Our apps may use the following authentication methods:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Sign-In:</strong> Allows you to log in using your Google account</li>
              <li><strong>Supabase Auth:</strong> Secure authentication service for user account management</li>
            </ul>
            <p className="mt-4">When you authenticate, we may collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your name</li>
              <li>Email address</li>
              <li>Profile photo (optional, if provided by your Google account)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Backend & Data Storage</h2>
            <p>We use secure backend services to power our applications:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Database:</strong> Supabase database is used to store app data and user preferences</li>
              <li><strong>File Storage:</strong> Supabase storage is used to store notes images, chapter pages, and other educational content</li>
              <li><strong>Session Management:</strong> User login sessions and access are managed securely via Supabase authentication</li>
            </ul>
            <p className="mt-4">All data is encrypted in transit and at rest to ensure your information remains secure.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Advertising (Google AdMob)</h2>
            <p>
              Exam Essentials apps, including MedOrtho, may display advertisements to support free content. 
              Ads are served by <strong>Google AdMob</strong>.
            </p>
            <p className="mt-4">AdMob may collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Advertising ID (a unique identifier for ad personalization)</li>
              <li>Ad interaction data (clicks, views)</li>
              <li>Approximate location (depending on your device settings)</li>
            </ul>
            <div className="bg-muted/50 p-4 rounded-lg border border-border mt-4">
              <p className="font-medium text-foreground">Your Control Over Ads</p>
              <p className="mt-2">
                You can disable ad personalization through your device's Google settings. 
                On Android, go to Settings → Google → Ads → Opt out of Ads Personalization.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. 
              All payment transactions are encrypted and processed through Razorpay's secure payment gateway.
              App data is protected using industry-standard encryption protocols.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">8. Third-Party Services</h2>
            <p>
              We use third-party services to provide and improve our services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Razorpay:</strong> For secure payment processing</li>
              <li><strong>Google Sign-In:</strong> For authentication</li>
              <li><strong>Supabase:</strong> For backend services and data storage</li>
              <li><strong>Google AdMob:</strong> For serving advertisements in our apps</li>
            </ul>
            <p className="mt-4">These services have their own privacy policies governing the use of your information.</p>
          </section>

          <section className="space-y-4 bg-primary/5 p-6 rounded-xl border border-primary/20">
            <h2 className="text-xl font-semibold text-foreground">9. MedOrtho App (Android) – Privacy Information</h2>
            <div className="space-y-4">
              <div>
                <p><strong>App Name:</strong> MedOrtho</p>
                <p><strong>Platform:</strong> Android</p>
                <p><strong>Category:</strong> Medical Education / Orthopedics Learning</p>
              </div>
              
              <div>
                <p className="font-medium text-foreground">Features:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Orthopedic Special Tests - Learn and practice clinical tests</li>
                  <li>Notes - Image-based chapter content for easy learning</li>
                  <li>MCQs / Quizzes - Test your knowledge with practice questions</li>
                  <li>Articles / Feeds - Stay updated with medical content</li>
                </ul>
              </div>

              <div>
                <p className="font-medium text-foreground">Data Collected by MedOrtho:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Account information (name, email) via Google Sign-In</li>
                  <li>Quiz scores and progress data</li>
                  <li>App usage analytics</li>
                  <li>Advertising data (via Google AdMob)</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                MedOrtho is part of the Exam Essentials family of educational apps. 
                The same privacy standards apply to all our applications.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">10. Children's Privacy</h2>
            <p>
              Our services are <strong>not intended for children under 13 years of age</strong>. 
              We do not knowingly collect personal information from children under 13.
            </p>
            <p>
              If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us immediately so we can take appropriate action.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">11. Your Rights & Choices</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Disable ad personalization</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <div className="bg-muted/50 p-4 rounded-lg border border-border mt-4">
              <p className="font-medium text-foreground">Data Deletion Request</p>
              <p className="mt-2">
                If you wish to delete your account and all associated data, please contact us at{" "}
                <a href="mailto:examessentials.info@gmail.com" className="text-primary hover:underline">
                  examessentials.info@gmail.com
                </a>{" "}
                with the subject line "Data Deletion Request".
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">12. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, 
              operational, or regulatory reasons. Any updates will be posted on this page with a revised "Last Updated" date.
            </p>
            <p>
              We encourage you to review this policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">13. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <p><strong>Exam Essentials</strong></p>
              <p className="mt-2">
                📧 Email:{" "}
                <a href="mailto:examessentials.info@gmail.com" className="text-primary hover:underline">
                  examessentials.info@gmail.com
                </a>
              </p>
              <p>
                📞 Phone:{" "}
                <a href="tel:+919460970342" className="text-primary hover:underline">
                  +91 94609 70342
                </a>
              </p>
              <p>
                🌐 Website:{" "}
                <a href="https://examessentials.in" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  https://examessentials.in
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
