"use client";
import { Button } from "@/components/ui/button";
function Google({ text }) {
  const googleAccess = async (e) => {
    e.preventDefault;
    const body = {
      auth_provider: "google",
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/auth/google/onetap/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("signup error:", response.status, data);
      }

      // console.log("signup successful:", data);
    } catch (error) {
      console.error("signup failed:", error);
    }
  };
  return (
    <Button
      onClick={googleAccess}
      className="w-full cursor-pointer mb-1 xl:mb-2 bg-transparent border border-[#606060] "
    >
      {text}
    </Button>
  );
}
export default Google;
