"use client";

import { useEffect } from "react";

type JsonLdProps = {
  data: unknown;
};

export default function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const DOMPurifyModule = await import("dompurify");
        const DOMPurify = (DOMPurifyModule && (DOMPurifyModule.default || DOMPurifyModule)) as any;
        const json = JSON.stringify(data);
        // sanitize the JSON string (defensive; JSON-LD is not HTML but sanitize anyway)
        const sanitized = DOMPurify.sanitize(json, { SAFE_FOR_JQUERY: true });

        if (!mounted) return;
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.text = sanitized;
        script.setAttribute("data-jsonld", "true");
        document.head.appendChild(script);

        return () => {
          if (document.head.contains(script)) document.head.removeChild(script);
        };
      } catch (e) {
        // If DOMPurify isn't available, fallback to a safe client-side insertion
        try {
          const script = document.createElement("script");
          script.type = "application/ld+json";
          script.text = JSON.stringify(data);
          script.setAttribute("data-jsonld", "true");
          document.head.appendChild(script);
        } catch (err) {
          // give up silently
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [data]);

  return null;
}
