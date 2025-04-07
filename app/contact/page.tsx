"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Facebook, Instagram, Mail, MapPin, Phone, Send, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function Contact() {
   return (
      <div className="flex min-h-screen flex-col">
         <main className="flex-1">
            {/* Hero Section */}
            <section className="w-full py-10 mt-16">
               <div className="container px-4 md:px-6 mx-auto">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-4 text-center">
                     <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">İletişim</h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                           Benimle iletişime geçin, sorularınızı yanıtlayayım, önerilerinizi dinleyeyim
                        </p>
                     </div>
                  </motion.div>
               </div>
            </section>

            {/* Contact Form and Info */}
            <section className="w-full py-10 bg-pattern-paper max-w-5xl mx-auto">
               <div className="container px-4 md:px-6 mx-auto">
                  <div className="gap-6 lg:gap-12 space-y-10">
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col space-y-4 pt-5">
                        <Card className="flex-1">
                           <CardHeader>
                              <CardTitle>İletişim Formu</CardTitle>
                              <CardDescription>Mesajınızı bırakın, en kısa sürede size dönüş yapacağım</CardDescription>
                           </CardHeader>
                           <CardContent>
                              <form className="space-y-4">
                                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                       <Label htmlFor="name">Adınız</Label>
                                       <Input id="name" placeholder="Adınız" />
                                    </div>
                                    <div className="space-y-2">
                                       <Label htmlFor="email">E-posta</Label>
                                       <Input id="email" type="email" placeholder="E-posta adresiniz" />
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="subject">Konu</Label>
                                    <Input id="subject" placeholder="Mesajınızın konusu" />
                                 </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="message">Mesajınız</Label>
                                    <Textarea id="message" placeholder="Mesajınızı buraya yazın..." rows={5} />
                                 </div>
                                 <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button type="submit" className="w-full cursor-pointer">
                                       <Send className="mr-2 h-4 w-4" /> Mesaj Gönder
                                    </Button>
                                 </motion.div>
                              </form>
                           </CardContent>
                        </Card>
                     </motion.div>

                     {/* Alt Dekoratif Çizgi */}
                     <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1 }} viewport={{ once: true }} className="w-full max-w-lg mx-auto">
                        <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
                     </motion.div>

                     <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2 w-full mx-auto flex flex-col items-center">
                           <h3 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Bana Ulaşın</h3>
                           <p className="text-muted-foreground">Kitaplarım, söyleşilerim veya işbirliği teklifleri için benimle iletişime geçebilirsiniz.</p>
                        </div>

                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                           <motion.div className="col-span-1" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                              <Card className="h-full">
                                 <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center gap-2">
                                       <Mail className="h-5 w-5 text-primary" /> E-posta
                                    </CardTitle>
                                 </CardHeader>
                                 <CardContent>
                                    <p className="text-sm">ahmet.yilmaz@example.com</p>
                                 </CardContent>
                              </Card>
                           </motion.div>

                           <motion.div className="col-span-1" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                              <Card className="h-full">
                                 <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center gap-2">
                                       <Phone className="h-5 w-5 text-primary" /> Telefon
                                    </CardTitle>
                                 </CardHeader>
                                 <CardContent>
                                    <p className="text-sm">+90 (212) 123 45 67</p>
                                    <p className="text-xs text-muted-foreground mt-1">Pazartesi - Cuma, 10:00 - 17:00</p>
                                 </CardContent>
                              </Card>
                           </motion.div>

                           <motion.div className="col-span-1" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                              <Card className="h-full">
                                 <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center gap-2">
                                       <MapPin className="h-5 w-5 text-primary" /> Adres
                                    </CardTitle>
                                 </CardHeader>
                                 <CardContent>
                                    <p className="text-sm">Yazar Yayınevi</p>
                                    <p className="text-sm">Bağdat Caddesi No: 123</p>
                                    <p className="text-sm">Kadıköy, İstanbul</p>
                                 </CardContent>
                              </Card>
                           </motion.div>

                           <motion.div className="col-span-1" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                              <Card className="h-full">
                                 <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center gap-2">
                                       <Calendar className="h-5 w-5 text-primary" /> Söyleşi ve İmza Günleri
                                    </CardTitle>
                                 </CardHeader>
                                 <CardContent>
                                    <p className="text-sm">Söyleşi ve imza günleri için takvimi kontrol edin veya e-posta ile bilgi alın.</p>
                                    <Link href="#" className="text-sm text-primary hover:underline mt-2 inline-block">
                                       Etkinlik Takvimini Görüntüle
                                    </Link>
                                 </CardContent>
                              </Card>
                           </motion.div>
                        </div>

                        {/* Alt Dekoratif Çizgi */}
                        <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1 }} viewport={{ once: true }} className="w-full max-w-lg mx-auto">
                           <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
                        </motion.div>

                        <div className="space-y-2 w-full mx-auto flex flex-col items-center">
                           <h3 className="text-xl font-bold">Sosyal Medya</h3>
                           <div className="flex gap-4">
                              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                                 <Link href="#" className="rounded-full p-2 text-muted-foreground hover:text-primary">
                                    <Instagram className="h-6 w-6" />
                                    <span className="sr-only">Instagram</span>
                                 </Link>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                                 <Link href="#" className="rounded-full p-2 text-muted-foreground hover:text-primary">
                                    <Twitter className="h-6 w-6" />
                                    <span className="sr-only">Twitter</span>
                                 </Link>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                                 <Link href="#" className="rounded-full p-2 text-muted-foreground hover:text-primary">
                                    <Facebook className="h-6 w-6" />
                                    <span className="sr-only">Facebook</span>
                                 </Link>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                                 <Link href="#" className="rounded-full p-2 text-muted-foreground hover:text-primary">
                                    <Youtube className="h-6 w-6" />
                                    <span className="sr-only">YouTube</span>
                                 </Link>
                              </motion.div>
                           </div>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full py-20">
               <div className="container px-4 md:px-6 mx-auto">
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: 1 }}
                     className="flex flex-col items-center justify-center space-y-4 text-center mb-10"
                  >
                     <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Sık Sorulan Sorular</h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">Okuyucularımın en çok merak ettiği sorular</p>
                     </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.2 }} className="mx-auto max-w-3xl">
                     <Tabs defaultValue="general" className="w-full">
                        <div className="flex justify-center mb-8">
                           <TabsList>
                              <TabsTrigger value="general">Genel</TabsTrigger>
                              <TabsTrigger value="books">Kitaplar</TabsTrigger>
                              <TabsTrigger value="events">Etkinlikler</TabsTrigger>
                           </TabsList>
                        </div>

                        <TabsContent value="general" className="space-y-4">
                           <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="item-1">
                                 <AccordionTrigger>Yazarlık serüveniniz nasıl başladı?</AccordionTrigger>
                                 <AccordionContent>
                                    Yazarlık serüvenim çocukluk yıllarımda tuttuğum günlüklerle başladı. Üniversite yıllarımda edebiyat dergilerinde öykülerim yayımlandı. İlk romanım "Gölgeler
                                    Şehri"ni 2010 yılında yayımladıktan sonra profesyonel yazarlık kariyerime başladım.
                                 </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="item-2">
                                 <AccordionTrigger>İlham kaynaklarınız nelerdir?</AccordionTrigger>
                                 <AccordionContent>
                                    Günlük hayattan, tarihten, insan ilişkilerinden ve seyahatlerimden ilham alıyorum. Farklı kültürleri tanımak, insanları gözlemlemek ve onların hikayelerini dinlemek
                                    bana yeni fikirler veriyor. Ayrıca müzik, sinema ve resim gibi diğer sanat dalları da yaratıcılığımı besliyor.
                                 </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="item-3">
                                 <AccordionTrigger>Yazma rutininiz nasıldır?</AccordionTrigger>
                                 <AccordionContent>
                                    Her sabah erken kalkar ve kahvaltıdan sonra en az 4 saat yazarım. Öğleden sonra araştırma yapar, notlarımı düzenler ve okurum. Akşamları ise yazdıklarımı gözden
                                    geçiririm. Disiplinli bir çalışma programım var ve her gün belirli bir kelime sayısına ulaşmayı hedeflerim.
                                 </AccordionContent>
                              </AccordionItem>
                           </Accordion>
                        </TabsContent>

                        <TabsContent value="books" className="space-y-4">
                           <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="item-1">
                                 <AccordionTrigger>Kitaplarınızı nereden satın alabilirim?</AccordionTrigger>
                                 <AccordionContent>
                                    Kitaplarımı tüm büyük kitapçılarda (D&R, Kitapyurdu, Remzi Kitabevi vb.) ve online satış platformlarında bulabilirsiniz. Ayrıca imzalı kopyalar için söyleşi ve imza
                                    günlerime katılabilir veya web sitemden sipariş verebilirsiniz.
                                 </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="item-2">
                                 <AccordionTrigger>Yeni bir kitap üzerinde çalışıyor musunuz?</AccordionTrigger>
                                 <AccordionContent>
                                    Evet, şu anda "Kayıp Zamanlar" adlı yeni bir roman üzerinde çalışıyorum. Pandemi döneminde kaybolan zamanları ve değişen insan ilişkilerini konu alan bu kitap,
                                    Eylül 2023'te raflarda olacak.
                                 </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="item-3">
                                 <AccordionTrigger>Kitaplarınız yabancı dillere çevriliyor mu?</AccordionTrigger>
                                 <AccordionContent>
                                    Evet, "Gölgeler Şehri" ve "Zamanın İzinde" adlı romanlarım İngilizce, Almanca, Fransızca ve İspanyolca'ya çevrildi. "Sessiz Çığlık" ise yakında Rusça ve Arapça
                                    olarak yayımlanacak.
                                 </AccordionContent>
                              </AccordionItem>
                           </Accordion>
                        </TabsContent>

                        <TabsContent value="events" className="space-y-4">
                           <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="item-1">
                                 <AccordionTrigger>Söyleşi ve imza günleriniz nasıl düzenleniyor?</AccordionTrigger>
                                 <AccordionContent>
                                    Söyleşi ve imza günlerim genellikle kitapçılar, kültür merkezleri, üniversiteler ve edebiyat festivalleri tarafından düzenleniyor. Etkinlik takvimimi web sitemden
                                    takip edebilir veya sosyal medya hesaplarımdan haberdar olabilirsiniz.
                                 </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="item-2">
                                 <AccordionTrigger>Yazarlık atölyelerinize nasıl katılabilirim?</AccordionTrigger>
                                 <AccordionContent>
                                    Yazarlık atölyelerim hakkında bilgi almak ve kayıt yaptırmak için web sitemdeki "Yazarlık Atölyesi" sayfasını ziyaret edebilir veya e-posta ile iletişime
                                    geçebilirsiniz. Atölyeler genellikle sınırlı kontenjanla düzenleniyor, bu nedenle erken kayıt yaptırmanızı öneririm.
                                 </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="item-3">
                                 <AccordionTrigger>Okul ve kütüphane ziyaretleri yapıyor musunuz?</AccordionTrigger>
                                 <AccordionContent>
                                    Evet, okul ve kütüphane ziyaretleri yapıyorum. Öğrencilerle buluşmak ve onlarla edebiyat üzerine sohbet etmek benim için çok değerli. Ziyaret talepleriniz için
                                    lütfen e-posta ile iletişime geçin.
                                 </AccordionContent>
                              </AccordionItem>
                           </Accordion>
                        </TabsContent>
                     </Tabs>
                  </motion.div>
               </div>
            </section>

            {/* Newsletter */}
            <section className="w-full py-10 bg-primary text-primary-foreground">
               <div className="container px-4 md:px-6 mx-auto">
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: 1.4 }}
                     className="flex flex-col items-center justify-center space-y-4 text-center"
                  >
                     <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Bültenime Abone Olun</h2>
                        <p className="mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                           Yeni kitaplarım, etkinliklerim ve özel içeriklerim hakkında haberdar olmak için bültenime abone olun.
                        </p>
                     </div>
                     <div className="mx-auto w-full max-w-sm space-y-2">
                        <form className="flex flex-col gap-2 sm:flex-row">
                           <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="E-posta adresiniz"
                              type="email"
                           />
                           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button type="submit" variant="secondary">
                                 Abone Ol
                              </Button>
                           </motion.div>
                        </form>
                        <p className="text-xs">Kişisel verileriniz gizlilik politikamıza uygun olarak korunacaktır.</p>
                     </div>
                  </motion.div>
               </div>
            </section>
         </main>
      </div>
   );
}

export default Contact;
