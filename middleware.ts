import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
   console.log("Middleware triggered for:", req.nextUrl.pathname); // Hangi path için tetiklendiğini logla
   console.log("All cookies received:", req.cookies.getAll()); // Gelen tüm cookieleri logla

   const tokenCookie = req.cookies.get("accessToken");
   console.log("accessToken Cookie Object:", tokenCookie); // accessToken cookie nesnesini logla

   // Nesnenin .value özelliğini kullanarak token değerini al (güvenli erişim için ?.)
   const tokenValue = tokenCookie?.value;
   console.log("accessToken Value:", tokenValue); // accessToken değerini logla

   const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

   if (isAdminRoute) {
      if (!tokenValue) {
         console.log("Token not found, redirecting to /tekonyok"); // Yönlendirme nedenini logla
         return NextResponse.redirect(new URL("/tekonyok", req.url));
      } else {
         // Token varsa /adminroute yerine doğrudan devam etmesini sağlayabilirsiniz
         // VEYA gerçekten /adminroute diye bir sayfanız varsa oraya yönlendirebilirsiniz.
         // Şimdilik sadece devam etmesini sağlıyorum:
         console.log("Token found, proceeding.");
         // return NextResponse.redirect(new URL("/adminroute", req.url)); // Eğer /adminroute varsa bu satırı kullanın
         return NextResponse.next(); // Token varsa normal işleme devam et
      }
   }

   return NextResponse.next();
};

export const config = {
   matcher: ["/admin/:path*"],
};
