import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
   const token = req.cookies.get("accessToken");

   const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

   if (isAdminRoute) {
      return NextResponse.redirect(new URL("/adminroute", req.url));
   }

   if (!token) {
      return NextResponse.redirect(new URL("/tekonyok", req.url));
   }

   return NextResponse.next();
};

export const config = {
   matcher: ["/admin/:path*"],
};
