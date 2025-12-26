import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-muted-foreground font-body text-lg max-w-xl mx-auto">
              We would love to hear from you. Feel free to reach out using the below details.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="border-b border-border rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary px-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Your email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="border-b border-border rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary px-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Enter subject"
                    className="border-b border-border rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary px-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your message (optional)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message"
                    rows={4}
                    className="border border-border rounded-md bg-transparent focus-visible:ring-0 focus-visible:border-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <MapPin className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Address:</h3>
                  <p className="text-muted-foreground">
                    Deewan complex, Behror, Rajasthan, 301701
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <Phone className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">WhatsApp Number:</h3>
                  <a 
                    href="https://api.whatsapp.com/send?phone=919460970342"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +91 9460970342
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <Mail className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email:</h3>
                  <a 
                    href="mailto:examessentials.info@gmail.com" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    examessentials.info@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
