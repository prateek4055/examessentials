import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type Layout = "sidebar" | "banner" | "in-article" | "multiplex";
interface AdSensePlaceholderProps {
  layout: Layout;
  className?: string;
  adSlot?: string;
}
const AD_CLIENT = "ca-pub-4205476272781282";
const SLOTS: Record<Layout, string> = {
  sidebar: "5310841463", banner: "2988806161",
  multiplex: "2684678128", "in-article": "2988806161",
};

function AdUnit({ layout, className = "", adSlot }: AdSensePlaceholderProps) {
  const container = useRef<HTMLDivElement>(null);
  const element = useRef<HTMLModElement>(null);
  const requested = useRef(false);

  useEffect(() => {
    // Local previews must not create live ad impressions.
    if (import.meta.env.DEV) return;
    let nearby = false;
    const request = () => {
      const ad = element.current;
      if (!nearby || !ad || requested.current || ad.getBoundingClientRect().width < 250) return;
      if (ad.hasAttribute("data-adsbygoogle-status")) return;
      requested.current = true;
      try {
        const adsWindow = window as Window & { adsbygoogle?: object[] };
        (adsWindow.adsbygoogle = adsWindow.adsbygoogle || []).push({});
      } catch (error) {
        console.warn("Ad unit could not be initialized", error);
      }
    };
    const intersection = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      request();
    }, { rootMargin: "200px 0px" });
    const resize = new ResizeObserver(request);
    if (container.current) intersection.observe(container.current);
    if (element.current) resize.observe(element.current);
    return () => { intersection.disconnect(); resize.disconnect(); };
  }, []);

  return (
    <div ref={container} aria-label="Advertisement" className={`adsense-container my-10 w-full min-w-0 rounded-xl border border-slate-100 bg-slate-50/50 px-2 py-3 text-center dark:border-slate-800 dark:bg-slate-900/30 ${className}`}>
      <span className="mb-3 block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Advertisement</span>
      <div className="min-h-[280px] w-full">
        {import.meta.env.DEV ? (
          <div className="flex min-h-[280px] items-center justify-center text-xs text-slate-400">Ad space · preview only</div>
        ) : (
          <ins ref={element} className="adsbygoogle" style={{ display: "block", width: "100%", minHeight: 280 }}
            data-ad-client={AD_CLIENT} data-ad-slot={adSlot || SLOTS[layout]}
            data-ad-format={layout === "multiplex" ? "autorelaxed" : "auto"}
            data-full-width-responsive={layout === "multiplex" ? undefined : "true"} />
        )}
      </div>
    </div>
  );
}

export default function AdSensePlaceholder(props: AdSensePlaceholderProps) {
  const { pathname } = useLocation();
  if (!/^\/medortho(?:\/|$)/.test(pathname)) return null;
  // A new page gets a new DOM unit; re-renders never refresh an existing ad.
  return <AdUnit key={`${pathname}:${props.layout}:${props.adSlot || ""}`} {...props} />;
}
