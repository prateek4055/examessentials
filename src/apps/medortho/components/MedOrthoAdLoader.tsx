import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function MedOrthoAdLoader() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (import.meta.env.DEV || !/^\/medortho(?:\/|$)/.test(pathname)) return;
    if (document.querySelector('script[data-medortho-ads]')) return;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.medorthoAds = "true";
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4205476272781282";
    document.head.appendChild(script);
  }, [pathname]);
  return null;
}
