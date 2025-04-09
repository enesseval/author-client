import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const middleware = async (req: NextRequest) => {
   const cookie = (await cookies()).get("accessToken");
   console.log("cookie", cookie);
   console.log("Middleware triggered for:", req.nextUrl.pathname); // Hangi path için tetiklendiğini logla

   // Gelen tüm başlıkları logla (req.headers kullan)
   console.log("All request headers:", Object.fromEntries(req.headers.entries()));

   console.log("All cookies received via req.cookies:", req.cookies.getAll()); // Gelen tüm cookieleri logla

   console.log("req", req);

   const tokenCookie = req.cookies.get("accessToken");
   console.log("accessToken Cookie Object:", tokenCookie); // accessToken cookie nesnesini logla

   // Nesnenin .value özelliğini kullanarak token değerini al (güvenli erişim için ?.)
   const tokenValue = tokenCookie?.value;
   console.log("accessToken Value:", tokenValue); // accessToken değerini logla
   55;
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
