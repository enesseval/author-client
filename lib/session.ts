import { cookies } from "next/headers";

export const updateUserSession = async () => {
   const cookie = (await cookies()).get("accessToken");

   if (cookie) {
      const token = cookie.value;
      return token;
   }
};
