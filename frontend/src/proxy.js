import { NextResponse } from "next/server";
import { decodeJWT } from "@/lib/auth";

// Route configuration
const ROUTE_CONFIG = {
  public: ["/", "/features", "/about", "/contact"],

  mainDomainAuth: [
    "/root/login",
    "/admin/login",
    "/admin/signup",
    "/admin/forgot-password",
    "/admin/reset-password",
  ],

  schoolDomainAuth: ["/portal"],

  schoolDomainRoutes: [
    "/student-dashboard",
    "/teacher-dashboard",
    "/parent-dashboard",
    "/recruiter-dashboard",
  ],

  mainDomainRoutes: ["/root", "/admin"],

  roleAccess: {
    root: {
      mainDomain: {
        allowedPrefix: "/root",
        defaultRedirect: "/root",
        denyRedirect: "/root",
      },
      schoolDomain: {
        allowAll: true,
      },
    },
    admin: {
      mainDomain: {
        allowedPrefix: "/admin",
        defaultRedirect: "/admin",
        denyPrefixes: ["/root"],
        denyRedirect: "/admin/login",
      },
      schoolDomain: {
        allowAll: true,
      },
    },
    student: {
      mainDomain: {
        deny: true,
        denyRedirect: "/admin/login",
      },
      schoolDomain: {
        allowedPrefix: "/student-dashboard",
        defaultRedirect: "/student-dashboard",
      },
    },
    teacher: {
      mainDomain: {
        deny: true,
        denyRedirect: "/admin/login",
      },
      schoolDomain: {
        allowedPrefix: "/teacher-dashboard",
        defaultRedirect: "/teacher-dashboard",
      },
    },
    parent: {
      mainDomain: {
        deny: true,
        denyRedirect: "/admin/login",
      },
      schoolDomain: {
        allowedPrefix: "/parent-dashboard",
        defaultRedirect: "/parent-dashboard",
      },
    },
    recruiter: {
      mainDomain: {
        deny: true,
        denyRedirect: "/admin/login",
      },
      schoolDomain: {
        allowedPrefix: "/recruiter-dashboard",
        defaultRedirect: "/recruiter-dashboard",
      },
    },
  },
};

export default function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  const host = request.headers.get("host") ?? "";
  const domain = host.split(":")[0];

  const MAIN_DOMAIN = process.env.MAIN_DOMAIN;

  // MAIN DOMAIN
  const isMainDomain = domain === MAIN_DOMAIN || domain === "localhost";

  // SCHOOL / SUBDOMAIN
  const isSchoolDomain =
    domain.endsWith(`.${MAIN_DOMAIN}`) || domain.endsWith(".localhost");

  // PUBLIC ROUTES - Allow without token (only on main domain)
  if (ROUTE_CONFIG.public.includes(path)) {
    if (isMainDomain) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  // AUTH ROUTES - Check if user is already logged in
  const isAuthRoute =
    ROUTE_CONFIG.mainDomainAuth.includes(path) ||
    ROUTE_CONFIG.schoolDomainAuth.includes(path);

  if (isAuthRoute && token) {
    // User is logged in, decode token to redirect to their dashboard
    const user = decodeJWT(token);

    if (user && user.role) {
      const roleConfig = ROUTE_CONFIG.roleAccess[user.role];

      if (roleConfig) {
        if (isMainDomain && roleConfig.mainDomain) {
          // Redirect to main domain dashboard
          const redirect = roleConfig.mainDomain.defaultRedirect || "/admin";
          return NextResponse.redirect(new URL(redirect, request.url));
        }

        if (isSchoolDomain && roleConfig.schoolDomain) {
          // Redirect to school domain dashboard
          const redirect = roleConfig.schoolDomain.defaultRedirect || "/portal";
          return NextResponse.redirect(new URL(redirect, request.url));
        }
      }
    }
  }

  // AUTH ROUTES - Allow without token (for login/signup)
  if (ROUTE_CONFIG.mainDomainAuth.includes(path)) {
    if (isMainDomain) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  if (ROUTE_CONFIG.schoolDomainAuth.includes(path)) {
    if (isSchoolDomain) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect school domain routes from main domain access
  if (isMainDomain) {
    const isSchoolRoute = ROUTE_CONFIG.schoolDomainRoutes.some((route) =>
      path.startsWith(route)
    );
    if (isSchoolRoute) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect main domain routes from school domain access
  if (isSchoolDomain) {
    const isMainRoute = ROUTE_CONFIG.mainDomainRoutes.some((route) =>
      path.startsWith(route)
    );
    if (isMainRoute) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }

    if (token) {
      const user = decodeJWT(token);
      if (user && (user.role === "root" || user.role === "admin")) {
        // Redirect root/admin back to their main domain dashboard
        const mainDomain = process.env.MAIN_DOMAIN || "localhost";
        const protocol = request.nextUrl.protocol;
        const redirect = user.role === "root" ? "/root" : "/admin";
        return NextResponse.redirect(
          new URL(`${protocol}//${mainDomain}${redirect}`)
        );
      }
    }
  }

  // PROTECTED ROUTES - Require token
  if (!token) {
    if (isMainDomain) {
      if (path.startsWith("/root")) {
        return NextResponse.redirect(new URL("/root/login", request.url));
      }
      if (path.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    } else {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  const user = decodeJWT(token);

  if (!user || !user.role) {
    if (isMainDomain) {
      if (path.startsWith("/root")) {
        return NextResponse.redirect(new URL("/root/login", request.url));
      }
      if (path.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    } else {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  // Get role configuration
  const roleConfig = ROUTE_CONFIG.roleAccess[user.role];

  if (!roleConfig) {
    // Unknown role
    if (isMainDomain) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    } else {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  // MAIN DOMAIN AUTHORIZATION
  if (isMainDomain) {
    const mainConfig = roleConfig.mainDomain;

    // Allow authenticated users to access public routes on main domain
    if (ROUTE_CONFIG.public.includes(path)) {
      return NextResponse.next();
    }

    // Check if role is denied on main domain
    if (mainConfig.deny) {
      return NextResponse.redirect(
        new URL(mainConfig.denyRedirect, request.url)
      );
    }

    // Check if accessing denied prefixes
    if (mainConfig.denyPrefixes) {
      const isDenied = mainConfig.denyPrefixes.some((prefix) =>
        path.startsWith(prefix)
      );
      if (isDenied) {
        return NextResponse.redirect(
          new URL(mainConfig.denyRedirect, request.url)
        );
      }
    }

    // Check if accessing allowed prefix
    if (mainConfig.allowedPrefix && path.startsWith(mainConfig.allowedPrefix)) {
      return NextResponse.next();
    }

    // Default redirect for main domain
    if (mainConfig.defaultRedirect) {
      return NextResponse.redirect(
        new URL(mainConfig.defaultRedirect, request.url)
      );
    }

    return NextResponse.next();
  }

  // SCHOOL DOMAIN AUTHORIZATION
  if (isSchoolDomain) {
    const schoolConfig = roleConfig.schoolDomain;

    // Check if role has full access
    if (schoolConfig.allowAll) {
      return NextResponse.next();
    }

    // Check if role is denied on school domain
    if (schoolConfig.deny) {
      return NextResponse.redirect(
        new URL(schoolConfig.denyRedirect, request.url)
      );
    }

    // Check if accessing allowed prefix
    if (
      schoolConfig.allowedPrefix &&
      path.startsWith(schoolConfig.allowedPrefix)
    ) {
      return NextResponse.next();
    }

    // Default redirect for school domain
    if (schoolConfig.defaultRedirect) {
      return NextResponse.redirect(
        new URL(schoolConfig.defaultRedirect, request.url)
      );
    }

    return NextResponse.redirect(new URL("/portal", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
