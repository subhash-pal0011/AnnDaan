// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function proxy(req) {
//        const pathname = req.nextUrl.pathname;

//        const publicPaths = ["/register", "/api/auth"];
//        const isPublicPath = publicPaths.some((path) =>
//               pathname.startsWith(path)
//        );

//        const token = await getToken({req,secret: process.env.AUTH_SECRET});

//        console.log("token :" ,token)

//        if (!token && !isPublicPath && pathname !== "/role") {
//               return NextResponse.redirect(new URL("/register", req.url));
//        }

//        const register_ke_bad = token && isPublicPath
//        console.log("path:" ,register_ke_bad)
//        if (token && isPublicPath) {
//               return NextResponse.redirect(new URL("/", req.url));
//        }

//        return NextResponse.next();
// }

// export const config = {
//        matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)"],
// };



// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function proxy(req) {
//        const pathname = req.nextUrl.pathname;

//        const publicPaths = ["/register", "/api/auth", "/role"];
//        const isPublicPath = publicPaths.some((path) =>
//               pathname.startsWith(path)
//        );

//        const token = await getToken({
//               req,
//               secret: process.env.AUTH_SECRET,
//        });

//        console.log("TOKEN:", token);
//        console.log("PATH:", pathname);

//        // ❌ Not logged in → block private routes
//        if (!token && !isPublicPath) {
//               return NextResponse.redirect(new URL("/register", req.url));
//        }

//        // ❌ Logged in user → don't allow register page
//        if (token && pathname.startsWith("/register")) {
//               return NextResponse.redirect(new URL("/", req.url));
//        }

//        return NextResponse.next();
// }

// export const config = {
//        matcher: [
//               "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
//        ],
// };



import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req) {
       const pathname = req.nextUrl.pathname;

       const publicPaths = ["/register", "/api/auth", "/role"];
       const isPublicPath = publicPaths.some((path) =>
              pathname.startsWith(path)
       );

       const token = await getToken({
              req,
              secret: process.env.NEXTAUTH_SECRET,
       });

       console.log("TOKEN:", token);
       console.log("PATH:", pathname);

       if (!token && !isPublicPath) {
              return NextResponse.redirect(new URL("/register", req.url));
       }

       if (token && pathname.startsWith("/register")) {
              return NextResponse.redirect(new URL("/", req.url));
       }

       return NextResponse.next();
}

export const config = {
       matcher: [
              "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
       ],
};