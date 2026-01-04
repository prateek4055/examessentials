import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const SOCIAL_PROOF_MESSAGES = [
  { emoji: "🔥", text: "Someone preparing for NEET just downloaded Physics Formula Sheets" },
  { emoji: "📘", text: "A Class 12 student bought Handwritten Physics Notes" },
  { emoji: "⭐", text: "Trending today among Physics students" },
  { emoji: "✅", text: "3 students purchased this in the last 24 hours" },
  { emoji: "📚", text: "Frequently bought by NEET & Class 12 aspirants" },
  { emoji: "🚀", text: "Popular choice for quick Physics revision" },
  { emoji: "🎯", text: "Students revising Mechanics are buying this now" },
  { emoji: "🧠", text: "Recommended by students preparing for boards & entrance exams" },
  { emoji: "🔒", text: "Limited-time access — students are enrolling fast" },
  { emoji: "📈", text: "One of today's most viewed Physics resources" },
];

const FIRST_POPUP_DELAY = 15000; // 15 seconds
const POPUP_INTERVAL = 40000; // 40 seconds
const AUTO_HIDE_DELAY = 5000; // 5 seconds
const MAX_POPUPS_PER_SESSION = 3;
const SESSION_KEY = "socialProofCount";

const SocialProofPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(SOCIAL_PROOF_MESSAGES[0]);
  const [popupCount, setPopupCount] = useState(0);

  const getRandomMessage = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * SOCIAL_PROOF_MESSAGES.length);
    return SOCIAL_PROOF_MESSAGES[randomIndex];
  }, []);

  const showPopup = useCallback(() => {
    const sessionCount = parseInt(sessionStorage.getItem(SESSION_KEY) || "0", 10);
    
    if (sessionCount >= MAX_POPUPS_PER_SESSION) {
      return;
    }

    setCurrentMessage(getRandomMessage());
    setIsVisible(true);
    
    const newCount = sessionCount + 1;
    sessionStorage.setItem(SESSION_KEY, newCount.toString());
    setPopupCount(newCount);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, AUTO_HIDE_DELAY);
  }, [getRandomMessage]);

  const handleClose = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    // Check session count on mount
    const sessionCount = parseInt(sessionStorage.getItem(SESSION_KEY) || "0", 10);
    if (sessionCount >= MAX_POPUPS_PER_SESSION) {
      return;
    }

    // First popup after 15 seconds
    const firstTimeout = setTimeout(() => {
      showPopup();
    }, FIRST_POPUP_DELAY);

    return () => clearTimeout(firstTimeout);
  }, [showPopup]);

  useEffect(() => {
    if (popupCount === 0 || popupCount >= MAX_POPUPS_PER_SESSION) {
      return;
    }

    // Subsequent popups every 40 seconds
    const interval = setInterval(() => {
      const sessionCount = parseInt(sessionStorage.getItem(SESSION_KEY) || "0", 10);
      if (sessionCount >= MAX_POPUPS_PER_SESSION) {
        clearInterval(interval);
        return;
      }
      showPopup();
    }, POPUP_INTERVAL);

    return () => clearInterval(interval);
  }, [popupCount, showPopup]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-4 left-4 z-50 max-w-[320px] sm:max-w-sm"
        >
          <div className="relative flex items-center gap-3 rounded-lg border border-border/50 bg-card/95 p-3 shadow-lg backdrop-blur-sm">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Thumbnail */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-2xl">
              {currentMessage.emoji}
            </div>

            {/* Message */}
            <p className="text-sm leading-snug text-foreground/90">
              {currentMessage.text}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofPopup;
