// learning to use middleware
// import { NextResponse } from "next/server";

// // This function can be marked `async` if using `await` inside
// export default function proxy(request) {
//   return NextResponse.redirect(new URL("/", request.url));
// }

// // Alternatively, you can use a default export:
// // export default function proxy(request) { ... }

// export const config = {
//   matcher: "/dashboard",
// };

import { NextResponse } from "next/server";

export default function middleware(request) {
  const token = request.cookies.get("token")?.value; // name of cookie should apear here

  //   logged in?
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // extract user info from token
  const user = extractUserFromToken(token);

  if (!user || !user.role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Get current path
  const path = request.nextUrl.pathname;

  const roleRoutes = {
    admin: "/admin-dashboard",
    teacher: "/teacher-dashboard",
    student: "/student-dashboard",
  };

  const userDashboard = roleRoutes[user.role];

  // accessing routes not allowed for their role
  if (path.startsWith("/admin-dashboard") && user.role !== "admin") {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  if (path.startsWith("/teacher-dashboard") && user.role !== "teacher") {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  if (path.startsWith("/student-dashboard") && user.role !== "student") {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/teacher-dashboard/:path*",
    "/student-dashboard/:path*",
  ],
};
