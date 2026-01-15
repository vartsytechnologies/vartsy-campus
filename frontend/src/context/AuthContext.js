// "use client";
// import { createContext, useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   // Call /api/auth/me to get user data
//   const checkAuth = async () => {
//     try {
//       const response = await fetch("/api/auth/me");

//       if (response.ok) {
//         const userData = await response.json();
//         setUser(userData); // {userId, email, role, name}
//       } else {
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("Auth check failed:", error);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Call /api/auth/logout to clear cookie
//   const logout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });
//       setUser(null);
//       router.push("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   const values = {
//     user,
//     loading,
//     logout,
//     refreshAuth: checkAuth,
//   };

//   return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };

"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

const PROTECTED_ROUTES = [
  "/root",
  "/admin",
  "/student-dashboard",
  "/teacher-dashboard",
  "/parent-dashboard",
  "/recruiter-dashboard",
];

const AUTH_ROUTES = [
  "/root/login",
  "/admin/login",
  "/admin/signup",
  "/admin/forgot-password",
  "/portal",
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

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

  useEffect(() => {
    // Check if current route needs user data
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute) {
      checkAuth();
    } else {
      setLoading(false);
      setUser(null);
    }
  }, [pathname]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
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
