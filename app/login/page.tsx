"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authApi } from "@/services/api/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
   username: z.string().min(1, { message: "Kullanıcı adı gereklidir" }),
   password: z.string().min(1, { message: "Şifre gereklidir" }),
});

function Login() {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
         setIsLoading(true);
         const response = await authApi.login(values);

         if (response.success) {
            toast.success("Giriş başarılı, yönlendiriliyorsunuz.");
            // router.push yerine window.location.href kullanarak tam sayfa yenilemesi yapalım
            window.location.href = "/admin";
         }
      } catch (error: any) {
         const errorMessage = error.response?.data?.message || "Giriş yapılırken bir hata oluştu";
         toast.error(errorMessage);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-pattern-paper p-4">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
            <Card className="border-2">
               <CardHeader className="space-y-1 text-center">
                  <div className="flex justify-center mb-2">
                     <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-primary" />
                     </div>
                  </div>
                  <CardTitle className="text-2xl">Yönetici Girişi</CardTitle>
                  <CardDescription>Yazar web sitesi yönetim paneline erişmek için giriş yapın</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <Form {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                           control={form.control}
                           name="username"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Kullanıcı Adı</FormLabel>
                                 <FormControl>
                                    <Input onChange={field.onChange} placeholder="Kullanıcı Adı" disabled={isLoading} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="password"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    <div className="flex items-center justify-between w-full">
                                       <FormLabel>Şifre</FormLabel>
                                       <a href="#" className="text-xs text-primary hover:underline">
                                          Şifremi Unuttum
                                       </a>
                                    </div>
                                 </FormLabel>
                                 <FormControl>
                                    <Input onChange={field.onChange} type="password" placeholder="********" disabled={isLoading} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <Button className="w-full" type="submit" disabled={isLoading}>
                           {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                        </Button>
                     </form>
                  </Form>
               </CardContent>
               <CardFooter className="text-center text-sm text-muted-foreground">
                  <p className="w-full">Bu alan sadece site yöneticileri içindir. Yetkisiz erişim yasaktır.</p>
                  <p className="text-muted-foreground">
                     Test kullanıcı adı: <span className="font-bold">admin</span> Test kullanıcı şifresi: <span className="font-bold">admin</span>
                  </p>
               </CardFooter>
            </Card>
         </motion.div>
      </div>
   );
}

export default Login;
