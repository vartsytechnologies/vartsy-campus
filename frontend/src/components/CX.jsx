"use client";

import { useEffect } from "react";

export default function CsrfInit() {
  useEffect(() => {
    const initCsrf = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/auth/csrf/`,
          {
            credentials: "include",
          },
        );
        if (!response.ok) {
          console.error("CSRF init error:", response.status);
        }
      } catch (err) {
        console.error("CSRF init failed:", err);
      }
    };

    initCsrf();
  }, []);

  return null;
}
