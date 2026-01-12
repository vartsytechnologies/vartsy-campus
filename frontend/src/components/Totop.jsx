"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowBigUp } from "lucide-react";

const ScrollToTop = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 700);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      onClick={scrollToTop}
      className={`
        rounded-lg fixed z-99 bottom-4 right-4 bg-(--custom-blue-4)!  p-3 
        transition-all duration-300 ease-in-out
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <ArrowBigUp className="stroke-[#01ffdd]" />
    </Button>
  );
};

export default ScrollToTop;
