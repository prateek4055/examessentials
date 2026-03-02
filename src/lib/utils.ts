import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { _SUPABASE_URL, PROXIED_SUPABASE_URL } from "@/integrations/supabase/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Transform image URL to use proxy if needed to bypass ISP blocks
export function getProxiedImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith(_SUPABASE_URL)) {
    return url.replace(_SUPABASE_URL, PROXIED_SUPABASE_URL);
  }
  return url;
}
