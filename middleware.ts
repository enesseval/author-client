import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
   const tokenCookie = req.cookies.get("accessToken");
   // Nesnenin .value özelliğini kullanarak token değerini al (güvenli erişim için ?.)
   const tokenValue = tokenCookie?.value;

   const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

   if (isAdminRoute) {
      if (!tokenValue) {
         return NextResponse.redirect(new URL("/tekonyok", req.url));
      } else {
         return NextResponse.redirect(new URL("/adminroute", req.url));
      }
   }

   return NextResponse.next();
};

export const config = {
   matcher: ["/admin/:path*"],
};
