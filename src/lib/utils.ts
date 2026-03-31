import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { _SUPABASE_URL, PROXIED_SUPABASE_URL } from "@/integrations/supabase/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Transform image URL to use proxy if needed to bypass ISP blocks
export function getProxiedImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  let finalUrl = url;

  // If it's a bare filename (doesn't start with http/https or /), prepend the Supabase storage path
  if (!url.startsWith('http') && !url.startsWith('/') && !url.includes('.supabase.co')) {
    finalUrl = `${_SUPABASE_URL}/storage/v1/object/public/product-images/${url}`;
  }

  // Forcefully rewrite any supabase.co URL to our proxy path to ensure it always works on Vercel
  // even if the environment variables are not loaded in the exact order
  if (finalUrl.includes('.supabase.co')) {
    try {
      const urlObj = new URL(finalUrl);
      if (urlObj.hostname.endsWith('.supabase.co')) {
        return `${window.location.origin}/supabase-api${urlObj.pathname}${urlObj.search}`;
      }
    } catch (e) {
      // Fallback for invalid URLs
      return finalUrl;
    }
  }

  return finalUrl;
}

