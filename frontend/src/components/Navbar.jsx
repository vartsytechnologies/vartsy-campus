"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("mobile-dropdown");
      const hamburger = document.getElementById("hamburger-button");

      if (
        isMenuOpen &&
        dropdown &&
        hamburger &&
        !dropdown.contains(event.target) &&
        !hamburger.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [lastScrollY, isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 w-11/12 md:w-10/12 bg-gray-100 mx-auto h-16 rounded-full flex items-center justify-center shadow-lg z-50 px-6 transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <div>
            <p className="font-bold text-gray-800">VartsySMS</p>
          </div>

          <div className="hidden lg:block">
            <ul className="flex items-center space-x-6 [&>li]:cursor-pointer [&>li]:font-semibold [&>li]:text-gray-800 [&>li]:hover:text-(--custom-blue-1) [&>li]:transition-colors">
              <li>Home</li>

              <li>About</li>
              <li>Features</li>
              <li>Book a Demo</li>
              <li>Contact</li>
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/signup">
              <button className="font-bold cursor-pointer hover:bg-(--custom-blue-2)/90 transition-colors duration-300 leading-none  rounded-full bg-(--custom-blue-4) px-6 md:px-10 py-3">
                Register
              </button>
            </Link>

            <button
              id="hamburger-button"
              onClick={toggleMenu}
              className="lg:hidden text-(--custom-blue-2) hover:text-(--custom-blue-1) transition-all duration-300"
            >
              <div
                className={`transition-transform duration-300 ${
                  isMenuOpen ? "rotate-90" : "rotate-0"
                }`}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-dropdown"
        className={`fixed top-28 left-1/2 -translate-x-1/2 w-11/12 bg-gray-100 rounded-3xl shadow-lg z-40 lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col py-2 px-6 space-y-2 [&>li]:cursor-pointer [&>li]:text-(--custom-blue-2) [&>li]:hover:text-(--custom-blue-1) [&>li]:transition-colors [&>li]:py-2">
          <li>Home</li>
          <li>Features</li>
          <li>About</li>
          <li>Book a Demo</li>
          <li>Contact</li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
