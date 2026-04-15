import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function proxy(req) {
       const session = await auth();
       const pathname = req.nextUrl.pathname;

       const publicPaths = ["/register", "/api/auth", "/role"];

       const isPublicPath = publicPaths.some((path) =>
              pathname.startsWith(path)
       );

       if (!session && !isPublicPath) {
              return NextResponse.redirect(new URL("/register", req.url));
       }

       if (session && pathname.startsWith("/register")) {
              return NextResponse.redirect(new URL("/", req.url));
       }

       const role = session?.user?.role;

       if (pathname.startsWith("/user") && role !== "organizer") {
              return NextResponse.redirect(new URL("/not_access_page", req.url));
       }

       if (pathname.startsWith("/ngo") && role !== "ngo") {
              return NextResponse.redirect(new URL("/not_access_page", req.url));
       }

       return NextResponse.next();
}

export const config = {
       matcher: [
              "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)$).*)",
       ],
};