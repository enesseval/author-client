import { cookies } from "next/headers";

export const updateUserSession = async () => {
   const cookie = (await cookies()).get("accessToken")?.value;

   if (cookie) {
      return cookie;
   }
};
