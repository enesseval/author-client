import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
   const token = req.cookies.get("accessToken");

   console.log(token);

   const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

   if (isAdminRoute && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
   }

   return NextResponse.next();
};

export const config = {
   matcher: ["/admin/:path*"],
};
