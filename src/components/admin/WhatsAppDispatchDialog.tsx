import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  Copy,
  Check,
  Download,
  Share2,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  FileText,
  Paperclip,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  DispatchDetails,
  formatWhatsAppPhone,
  generateWhatsAppMessage,
  openWhatsAppChat,
  downloadPdfFromUrl,
  sharePdfFileDirectly,
} from "@/lib/whatsappDelivery";

interface WhatsAppDispatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  details: DispatchDetails | null;
}

export const WhatsAppDispatchDialog = ({
  isOpen,
  onClose,
  details,
}: WhatsAppDispatchDialogProps) => {
  const { toast } = useToast();
  const [copiedText, setCopiedText] = useState(false);
  const [copiedPwd, setCopiedPwd] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [isProcessingCombined, setIsProcessingCombined] = useState(false);

  if (!details) return null;

  const { fullPhone, cleanPassword } = formatWhatsAppPhone(details.phone);
  const effectivePassword = details.cleanPassword || cleanPassword;

  // Clean WhatsApp caption — strictly NO links
  const whatsappMessage = generateWhatsAppMessage({
    studentName: details.studentName,
    phone: details.phone,
    cleanPassword: effectivePassword,
    products: details.products,
    orderId: details.orderId,
  });

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopiedText(true);
      toast({ title: "Copied!", description: "WhatsApp message copied to clipboard." });
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      toast({ title: "Copy Failed", description: "Please copy the text manually.", variant: "destructive" });
    }
  };

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(effectivePassword);
      setCopiedPwd(true);
      toast({ title: "Password Copied", description: effectivePassword });
      setTimeout(() => setCopiedPwd(false), 2000);
    } catch {
      toast({ title: "Copy Failed", variant: "destructive" });
    }
  };

  // Download a specific product's protected PDF
  const handleDownloadPdf = async (prod: { id: string; title: string; secure_download_url?: string }) => {
    if (!prod.secure_download_url) {
      toast({ title: "Download Unavailable", description: "PDF URL is missing.", variant: "destructive" });
      return;
    }
    setDownloadingId(prod.id);
    try {
      const cleanTitle = prod.title.replace(/[^a-zA-Z0-9_-]/g, "_");
      await downloadPdfFromUrl(prod.secure_download_url, `${cleanTitle}_Protected.pdf`);
      toast({
        title: "Protected PDF Downloaded! 📥",
        description: `Saved as ${cleanTitle}_Protected.pdf. Ready to attach in WhatsApp.`,
      });
    } catch (err: any) {
      toast({ title: "Download Error", description: err?.message || "Failed to download.", variant: "destructive" });
    } finally {
      setDownloadingId(null);
    }
  };

  // 1-Click: Download PDF & Open WhatsApp Web immediately
  const handleDownloadAndOpenWhatsApp = async () => {
    setIsProcessingCombined(true);
    try {
      // 1. Download all selected protected PDFs
      for (const prod of details.products) {
        if (prod.secure_download_url) {
          const cleanTitle = prod.title.replace(/[^a-zA-Z0-9_-]/g, "_");
          await downloadPdfFromUrl(prod.secure_download_url, `${cleanTitle}_Protected.pdf`);
        }
      }

      // 2. Open WhatsApp Web / App with pretyped message
      openWhatsAppChat(fullPhone, whatsappMessage);

      toast({
        title: "PDF Downloaded & WhatsApp Opening! 🚀",
        description: "Drag the downloaded PDF from your download tray into WhatsApp to attach it.",
      });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Action failed.", variant: "destructive" });
    } finally {
      setIsProcessingCombined(false);
    }
  };

  // Direct native share if supported (macOS Safari/Chrome, iOS, Android)
  const handleNativeShare = async (prod: { id: string; title: string; secure_download_url?: string }) => {
    if (!prod.secure_download_url) return;
    setSharingId(prod.id);
    try {
      const cleanTitle = prod.title.replace(/[^a-zA-Z0-9_-]/g, "_");
      const success = await sharePdfFileDirectly(
        prod.secure_download_url,
        `${cleanTitle}_Protected.pdf`,
        whatsappMessage
      );
      if (!success) {
        handleDownloadAndOpenWhatsApp();
      }
    } catch {
      handleDownloadAndOpenWhatsApp();
    } finally {
      setSharingId(null);
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground font-body p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                Direct WhatsApp PDF Delivery
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs">
                  Attach Directly
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Send the password-protected PDF directly on WhatsApp — customer opens the file in chat without external links.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Email Status Alert (if email was attempted) */}
        {details.email && (
          <div
            className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              details.emailSent
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : details.emailError
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-secondary border-border text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              <span>
                {details.emailSent ? (
                  <>Email sent to <strong>{details.email}</strong></>
                ) : details.emailError ? (
                  <>Email service had an issue ({details.emailError}). <strong>Attach via WhatsApp below!</strong></>
                ) : (
                  <>Email skipped for <strong>{details.email}</strong></>
                )}
              </span>
            </div>
            {details.emailSent ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            )}
          </div>
        )}

        {/* Student & Password Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-secondary/40 border border-border rounded-xl p-4">
          <div>
            <span className="text-xs text-muted-foreground block">Student Name</span>
            <p className="font-semibold text-foreground text-sm">{details.studentName}</p>
            <span className="text-xs text-muted-foreground mt-1 block">WhatsApp Phone</span>
            <p className="font-mono text-emerald-500 text-sm font-semibold">+{fullPhone}</p>
          </div>

          <div className="sm:border-l sm:border-border sm:pl-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3 text-purple-400" /> PDF Password
                </span>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
                >
                  {copiedPwd ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedPwd ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="font-mono text-lg font-bold text-purple-400 tracking-wider mt-0.5">
                {effectivePassword}
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Customer unlocks the attached file using this 10-digit number.
            </p>
          </div>
        </div>

        {/* Protected PDFs to Attach */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-emerald-400" />
              <span>Protected PDF Files to Attach ({details.products.length})</span>
            </label>
            <span className="text-[11px] text-emerald-400 font-medium">
              Watermarked &amp; Encrypted
            </span>
          </div>

          <div className="space-y-2">
            {details.products.map((prod) => (
              <div
                key={prod.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-secondary border border-border hover:border-emerald-500/40 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5 text-purple-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{prod.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Locked with password: <span className="font-mono text-purple-400 font-bold">{effectivePassword}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {canNativeShare && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleNativeShare(prod)}
                      disabled={sharingId === prod.id}
                      className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                      title="Attach directly to WhatsApp using system share"
                    >
                      <Share2 className="w-3.5 h-3.5 mr-1.5" />
                      {sharingId === prod.id ? "Attaching..." : "Attach & Share"}
                    </Button>
                  )}

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadPdf(prod)}
                    disabled={downloadingId === prod.id}
                    className="text-xs border-border hover:bg-purple-500/10 hover:text-purple-400 font-medium"
                    title="Download this protected PDF to your computer"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    {downloadingId === prod.id ? "Downloading..." : "Download PDF"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Attach Guide (Visual & Simple) */}
        <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
          <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <Paperclip className="w-3.5 h-3.5" />
            How to send the PDF directly to the student:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="p-2 rounded-lg bg-background/50 border border-border/60">
              <span className="font-bold text-foreground block">1. Download PDF</span>
              <span>Click the green button below to save the protected PDF file.</span>
            </div>
            <div className="p-2 rounded-lg bg-background/50 border border-border/60">
              <span className="font-bold text-foreground block">2. Open WhatsApp</span>
              <span>WhatsApp Web opens automatically with the student&apos;s chat.</span>
            </div>
            <div className="p-2 rounded-lg bg-background/50 border border-border/60">
              <span className="font-bold text-foreground block">3. Drag &amp; Drop</span>
              <span>Drag the downloaded PDF into the chat and press send!</span>
            </div>
          </div>
        </div>

        {/* Pretyped WhatsApp Message Preview (NO LINKS) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pretyped Caption (No Links - File Attachment Message)
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyMessage}
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
            >
              {copiedText ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-emerald-400" /> Copied Caption
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" /> Copy Caption
                </>
              )}
            </Button>
          </div>

          <div className="bg-secondary/70 border border-border rounded-lg p-3 text-xs font-mono text-foreground/90 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed selection:bg-purple-500/30">
            {whatsappMessage}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Button
              type="button"
              onClick={handleDownloadAndOpenWhatsApp}
              disabled={isProcessingCombined}
              className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 shadow-lg shadow-emerald-600/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF &amp; Open WhatsApp Web
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => openWhatsAppChat(fullPhone, whatsappMessage)}
              className="w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 mr-1.5 text-emerald-400" />
              Open Chat Only
            </Button>
          </div>

          <p className="text-[11px] text-center text-muted-foreground">
            The customer will open the attached PDF directly in their WhatsApp app and enter their phone number (<strong>{effectivePassword}</strong>) to view the notes.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
