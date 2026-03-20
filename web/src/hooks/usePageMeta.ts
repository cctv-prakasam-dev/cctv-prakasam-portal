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
  el.setAttribute("content", content.replace(/"/g, "&quot;"));
}

const BASE_URL = "https://cctv-prakasam-portal-g3il.onrender.com";

export function usePageMeta({ title, description, image }: PageMeta) {
  useEffect(() => {
    const fullTitle = `${title} — CCTV AP Prakasam`;
    document.title = fullTitle;

    setMeta("og:title", fullTitle);
    setMeta("twitter:title", fullTitle);
    setMeta("og:url", `${BASE_URL}${window.location.pathname}`);

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description);
      setMeta("twitter:description", description);
    }

    const ogImage = image?.startsWith("http") ? image : `${BASE_URL}${image || "/og-image.png"}`;
    setMeta("og:image", ogImage);
    setMeta("twitter:image", ogImage);
  }, [title, description, image]);
}
