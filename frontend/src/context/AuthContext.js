"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me/`,
        {
          credentials: "include",
        },
      );

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

  // Check auth once on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout/`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);

      const hostname = window.location.hostname;
      const mainDomain = process.env.NEXT_PUBLIC_DOMAIN;

      const isMainDomain =
        hostname === mainDomain || hostname === `www.${mainDomain}`;

      router.push(isMainDomain ? "/login" : "/portal");
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
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
