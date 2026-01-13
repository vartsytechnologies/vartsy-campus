"use client";
import { createContext, useContext, useState, useEffect } from "react";
// import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  //   const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    console.log("Checking authentication status...");
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  };
  //   const checkAuth = async () => {
  //     // const token = localStorage.getItem("token");

  //     // if (!token) {
  //     //   setLoading(false);
  //     //   return;
  //     // }

  //     try {
  //       const response = await fetch("/api/auth/verify", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         setUser(data.user);
  //       } else {
  //         localStorage.removeItem("token");
  //       }
  //     } catch (error) {
  //       console.error("Auth check failed:", error);
  //       localStorage.removeItem("token");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const login = async (email, password) => {
  //     const response = await fetch("/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || "Login failed");
  //     }

  //     localStorage.setItem("token", data.token);
  //     setUser(data.user);

  //     // Redirect based on role
  //     const routes = {
  //       ADMIN: "/admin-dashboard",
  //       TEACHER: "/teacher-dashboard",
  //       STUDENT: "/student-dashboard",
  //     };
  //     router.push(routes[data.user.role] || "/login");
  //   };

  const logout = () => {
    setUser(null);
    router.push("/login");
  };
  const values = { user, loading, setUser, logout };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
