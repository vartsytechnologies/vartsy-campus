"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { resolve } from "styled-jsx/css";

const AuthContext = createContext();

const PROTECTED_ROUTES = [
  "/root",
  "/admin",
  "/student",
  "/teacher",
  "/parent",
  "/recruiter",
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me/`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        console.error("Login error:", response.status);
      }

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data (only once per session)
  useEffect(() => {
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

    if (isProtectedRoute && !hasCheckedAuth) {
      checkAuth().then(() => setHasCheckedAuth(true));
    }
  }, [pathname, hasCheckedAuth]);

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout/`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setHasCheckedAuth(false);

      const hostname = window.location.hostname;
      const mainDomain = process.env.NEXT_PUBLIC_DOMAIN;

      const isMainDomain =
        hostname === mainDomain || hostname === `www.${mainDomain}`;

      router.push(isMainDomain ? "/login" : "/portal");
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
      setHasCheckedAuth(false);
      router.push("/portal");
    }
  };

  const values = {
    user,
    loading,
    logout,
    refreshAuth: checkAuth,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
