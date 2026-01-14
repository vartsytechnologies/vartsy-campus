// // learning to use middleware
// // import { NextResponse } from "next/server";

// // // This function can be marked `async` if using `await` inside
// // export default function proxy(request) {
// //   return NextResponse.redirect(new URL("/", request.url));
// // }

// // // Alternatively, you can use a default export:
// // // export default function proxy(request) { ... }

// // export const config = {
// //   matcher: "/dashboard",
// // };

import { NextResponse } from "next/server";
import { decodeJWT } from "@/lib/auth";

export default function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;
  // const hostname = request.headers.get("host");

  // // Check domain

  // const maindomain = process.env.MAIN_DOMAIN;
  // const localhost = process.env.LOCALHOST;
  // const testdomain = process.env.TESTDOMAIN;

  // const isMainDomain = hostname === maindomain || hostname === localhost;
  // // const isSchoolDomain = !isMainDomain;
  // const isSchoolDomain = !isMainDomain || hostname === testdomain;

  const host = request.headers.get("host") ?? "";
  const domain = host.split(":")[0];

  // ENV (server-only, safe)
  const MAIN_DOMAIN = process.env.MAIN_DOMAIN;

  // MAIN DOMAIN
  const isMainDomain = domain === MAIN_DOMAIN || domain === "localhost";

  // SCHOOL / SUBDOMAIN
  const isSchoolDomain =
    domain.endsWith(`.${MAIN_DOMAIN}`) || domain.endsWith(".localhost");

  //  Allow without token
  if (path === "/") {
    return NextResponse.next();
  }

  // AUTH ROUTES - Allow without token
  // Main domain: /root/login, /admin/login, /admin/signup, /admin/forgot-password
  if (
    path === "/root/login" ||
    path === "/admin/login" ||
    path === "/admin/signup" ||
    path === "/admin/forgot-password"
  ) {
    if (isMainDomain) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  if (path === "/portal") {
    if (isSchoolDomain) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect school domain dashboards from main domain access
  if (isMainDomain) {
    if (
      path.startsWith("/student-dashboard") ||
      path.startsWith("/teacher-dashboard") ||
      path.startsWith("/parent-dashboard") ||
      path.startsWith("/recruiter-dashboard")
    ) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect main domain dashboards from school domain access
  if (isSchoolDomain) {
    if (path.startsWith("/root") || path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  // PROTECTED ROUTES
  if (!token) {
    if (isMainDomain) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    } else {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  const user = decodeJWT(token);

  if (!user || !user.role) {
    if (isMainDomain) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    } else {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  // MAIN DOMAIN AUTHORIZATION
  if (isMainDomain) {
    if (user.role === "root") {
      return NextResponse.next();
    }

    if (user.role === "admin") {
      if (path.startsWith("/admin")) {
        return NextResponse.next();
      }

      if (path.startsWith("/root")) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // SCHOOL DOMAIN AUTHORIZATION
  if (isSchoolDomain) {
    if (user.role === "root") {
      return NextResponse.next();
    }

    if (user.role === "admin") {
      return NextResponse.next();
    }

    if (user.role === "student") {
      if (path.startsWith("/student-dashboard")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/student-dashboard", request.url));
    }

    if (user.role === "teacher") {
      if (path.startsWith("/teacher-dashboard")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/teacher-dashboard", request.url));
    }

    if (user.role === "parent") {
      if (path.startsWith("/parent-dashboard")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/parent-dashboard", request.url));
    }

    if (user.role === "recruiter") {
      if (path.startsWith("/recruiter-dashboard")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(
        new URL("/recruiter-dashboard", request.url)
      );
    }

    return NextResponse.redirect(new URL("/portal", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
