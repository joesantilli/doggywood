"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    sc_project?: number;
    sc_invisible?: number;
    sc_security?: string;
  }
}

export function Statcounter() {
  useEffect(() => {
    window.sc_project = 13355025;
    window.sc_invisible = 1;
    window.sc_security = "88bd162c";

    const script = document.createElement("script");
    script.src = "https://www.statcounter.com/counter/counter.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
