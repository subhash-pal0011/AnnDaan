import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req) {
       const pathname = req.nextUrl.pathname;

       // const publicPaths = ["/register", "/api/auth"];
       const publicPaths = ["/register", "/api/auth", "/role"];
       const isPublicPath = publicPaths.some((path) =>
              pathname.startsWith(path)
       );

       const token = await getToken({req,secret: process.env.AUTH_SECRET});
       

       if (!token && !isPublicPath && pathname !== "/role") {
              return NextResponse.redirect(new URL("/register", req.url));
       }

       if (token && isPublicPath) {
              return NextResponse.redirect(new URL("/", req.url));
       }

       return NextResponse.next();
}

export const config = {
       matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)"],
};