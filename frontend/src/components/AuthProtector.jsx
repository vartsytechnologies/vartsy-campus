// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";

// export function AuthProtector({ children, allowedRoles = [] }) {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading) {
//       if (!user) {
//         router.push("/login");
//       } else if (allowedRoles.length && !allowedRoles.includes(user.role)) {
//         // Wrong role - redirect to their dashboard
//         const routes = {
//           ADMIN: "/admin-dashboard",
//           TEACHER: "/teacher-dashboard",
//           STUDENT: "/student-dashboard",
//         };
//         router.replace(routes[user.role] || "/login");
//       }
//     }
//   }, [user, loading, router, allowedRoles]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user || (allowedRoles.length && !allowedRoles.includes(user.role))) {
//     return null;
//   }

//   return <>{children}</>;
// }
