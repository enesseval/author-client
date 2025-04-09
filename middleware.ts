import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateUserSession } from "./lib/session";

export const middleware = async (req: NextRequest) => {
   const token = updateUserSession();

   console.log("Token:", token);

   const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

   // if (isAdminRoute) {
   //    if (!tokenValue) {
   //       console.log("Token not found, redirecting to /tekonyok"); // Yönlendirme nedenini logla
   //       return NextResponse.redirect(new URL("/tekonyok", req.url));
   //    } else {
   //       // Token varsa /adminroute yerine doğrudan devam etmesini sağlayabilirsiniz
   //       // VEYA gerçekten /adminroute diye bir sayfanız varsa oraya yönlendirebilirsiniz.
   //       // Şimdilik sadece devam etmesini sağlıyorum:
   //       console.log("Token found, proceeding.");
   //       // return NextResponse.redirect(new URL("/adminroute", req.url)); // Eğer /adminroute varsa bu satırı kullanın
   //       return NextResponse.next(); // Token varsa normal işleme devam et
   //    }
   // }

   return NextResponse.next();
};

export const config = {
   matcher: ["/admin/:path*"],
};
