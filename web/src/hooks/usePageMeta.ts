import { useEffect } from "react";

interface PageMeta {
  title: string;
  description?: string;
  image?: string;
}

function setMeta(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    if (property.startsWith("og:")) {
      el.setAttribute("property", property);
    }
    else {
      el.setAttribute("name", property);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function usePageMeta({ title, description, image }: PageMeta) {
  useEffect(() => {
    const fullTitle = `${title} — CCTV AP Prakasam`;
    document.title = fullTitle;

    setMeta("og:title", fullTitle);
    setMeta("twitter:title", fullTitle);

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description);
      setMeta("twitter:description", description);
    }

    if (image) {
      setMeta("og:image", image);
      setMeta("twitter:image", image);
    }
  }, [title, description, image]);
}
