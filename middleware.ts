import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateUserSession } from "./lib/session";

export const middleware = async (req: NextRequest) => {
   const token = updateUserSession();

   console.log("Token:", token);

   const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

   if (isAdminRoute && !token) NextResponse.redirect(new URL("/login", req.url));

   return NextResponse.next();
};

export const config = {
   matcher: ["/admin/:path*"],
};
