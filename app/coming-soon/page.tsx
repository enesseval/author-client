"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Calendar, Clock, Mic, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

function ComingSoon() {
   const projects = [
      {
         id: 1,
         title: "Kayıp Zamanlar",
         type: "Kitap",
         category: "Roman",
         image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop",
         releaseDate: "Eylül 2023",
         description: "Pandemi döneminde kaybolan zamanları ve değişen insan ilişkilerini konu alan yeni roman.",
         longDescription:
            "Pandemi döneminde kaybolan zamanları ve değişen insan ilişkilerini konu alan yeni roman. Küresel bir salgının insanların hayatlarını nasıl değiştirdiğini, izolasyon sürecinde yaşanan içsel yolculukları ve toplumsal dönüşümü ele alan bu roman, modern çağın en büyük krizlerinden birini edebi bir dille anlatıyor.",
         progress: 90,
         features: ["Pandemi döneminin psikolojik etkileri", "İzolasyon ve yalnızlık temaları", "Değişen insan ilişkileri", "Dijital çağda iletişim"],
      },
      {
         id: 2,
         title: "Yazarın Dünyası",
         type: "Podcast",
         category: "Söyleşi",
         image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=1000&auto=format&fit=crop",
         releaseDate: "Ağustos 2023",
         description: "Yazarlık serüvenim, ilham kaynaklarım ve yazma teknikleri hakkında konuşacağım podcast serisi.",
         longDescription:
            "Yazarlık serüvenim, ilham kaynaklarım ve yazma teknikleri hakkında konuşacağım podcast serisi. Her bölümde yazarlık mesleğinin farklı bir yönünü ele alacak, kendi deneyimlerimi paylaşacak ve konuk yazarlarla söyleşiler gerçekleştireceğim.",
         progress: 70,
         features: ["Yazarlık serüveni ve deneyimler", "Yazma teknikleri ve ipuçları", "Konuk yazarlarla söyleşiler", "Okuyucu sorularının yanıtlanması"],
      },
      {
         id: 3,
         title: "Edebiyat Atölyesi",
         type: "Online Kurs",
         category: "Eğitim",
         image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop",
         releaseDate: "Ekim 2023",
         description: "Yazarlık yolculuğuna başlamak isteyenler için kapsamlı bir online eğitim programı.",
         longDescription:
            "Yazarlık yolculuğuna başlamak isteyenler için kapsamlı bir online eğitim programı. Karakter yaratma, olay örgüsü oluşturma, diyalog yazma ve düzenleme teknikleri gibi konuları içeren bu kurs, katılımcılara kendi hikayelerini yazma fırsatı sunacak.",
         progress: 60,
         features: ["Karakter yaratma teknikleri", "Olay örgüsü oluşturma", "Diyalog yazma", "Düzenleme ve revizyon teknikleri", "Birebir geri bildirim seansları"],
      },
      {
         id: 4,
         title: "İstanbul'un İzinde",
         type: "Belgesel",
         category: "Video",
         image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1000&auto=format&fit=crop",
         releaseDate: "Aralık 2023",
         description: "İstanbul'un tarihi ve kültürel dokusunu keşfettiğim, kitaplarıma ilham veren mekanları gezdiğim belgesel serisi.",
         longDescription:
            "İstanbul'un tarihi ve kültürel dokusunu keşfettiğim, kitaplarıma ilham veren mekanları gezdiğim belgesel serisi. Tarihi yarımada, Boğaz, adalar ve şehrin gizli kalmış köşelerini keşfederek, İstanbul'un edebiyatımızdaki yerini ve benim eserlerime olan etkisini anlatacağım.",
         progress: 40,
         features: ["İstanbul'un tarihi mekanları", "Edebiyatta İstanbul teması", "Yazarların ilham kaynakları", "Şehrin gizli kalmış köşeleri"],
      },
      {
         id: 5,
         title: "Dünya Edebiyatı Sohbetleri",
         type: "YouTube Serisi",
         category: "Video",
         image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=1000&auto=format&fit=crop",
         releaseDate: "Kasım 2023",
         description: "Dünya edebiyatından önemli eserleri ve yazarları incelediğim, edebiyat tutkunları için hazırladığım video serisi.",
         longDescription:
            "Dünya edebiyatından önemli eserleri ve yazarları incelediğim, edebiyat tutkunları için hazırladığım video serisi. Klasiklerden modern eserlere, farklı kültürlerden yazarların eserlerini analiz ederek edebiyat dünyasına geniş bir perspektiften bakacağız.",
         progress: 50,
         features: ["Klasik ve modern eserler", "Yazar biyografileri ve etkileri", "Edebi akımlar ve dönemler", "Kitap önerileri ve incelemeler"],
      },
   ];

   const container = {
      hidden: { opacity: 0 },
      show: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
         },
      },
   };

   const item = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 },
   };

   return (
      <div className="flex min-h-screen flex-col">
         <main className="flex-1">
            {/* Hero Section */}
            <section className="w-full py-10 mt-16">
               <div className="container px-4 md:px-6 mx-auto">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-4 text-center">
                     <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Yakında</h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                           Üzerinde çalıştığım ve yakında sizlerle buluşacak olan projelerim
                        </p>
                     </div>
                  </motion.div>
               </div>
            </section>

            {/* Tabs Section */}
            <section className="w-full py-10 bg-pattern-paper">
               <div className="container px-4 md:px-6 mx-auto">
                  <Tabs defaultValue="all" className="w-full">
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="flex justify-center mb-8">
                        <TabsList>
                           <TabsTrigger value="all">Tüm Projeler</TabsTrigger>
                           <TabsTrigger value="book">Kitaplar</TabsTrigger>
                           <TabsTrigger value="media">Medya</TabsTrigger>
                           <TabsTrigger value="education">Eğitim</TabsTrigger>
                        </TabsList>
                     </motion.div>

                     <TabsContent value="all" className="space-y-8">
                        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {projects.map((project) => (
                              <motion.div key={project.id} variants={item}>
                                 <Card className="flex flex-col h-full">
                                    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                                       <Image
                                          src={project.image || "/placeholder.svg"}
                                          alt={project.title}
                                          width={500}
                                          height={300}
                                          className="object-cover w-full h-full transition-transform hover:scale-105"
                                       />
                                       <div className="absolute top-2 right-2">
                                          <Badge className="bg-primary/90 hover:bg-primary/90">{project.type}</Badge>
                                       </div>
                                    </div>
                                    <CardHeader className="p-4">
                                       <CardTitle className="text-lg">{project.title}</CardTitle>
                                       <CardDescription className="flex items-center gap-2 mt-1">
                                          <Calendar className="h-4 w-4" />
                                          <span>{project.releaseDate}</span>
                                       </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 flex-grow">
                                       <p className="text-sm text-muted-foreground">{project.description}</p>
                                       <div className="flex flex-wrap gap-2 mt-4">
                                          <Badge variant="outline">{project.category}</Badge>
                                          <Badge variant="secondary">
                                             <Clock className="h-3 w-3 mr-1" /> %{project.progress} Tamamlandı
                                          </Badge>
                                       </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                       <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                          <Button variant="outline" className="w-full cursor-pointer">
                                             Detaylar
                                          </Button>
                                       </motion.div>
                                    </CardFooter>
                                 </Card>
                              </motion.div>
                           ))}
                        </motion.div>
                     </TabsContent>

                     <TabsContent value="book" className="space-y-8">
                        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {projects
                              .filter((project) => project.type === "Kitap")
                              .map((project) => (
                                 <motion.div key={project.id} variants={item}>
                                    <Card className="flex flex-col h-full">
                                       <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                                          <Image
                                             src={project.image || "/placeholder.svg"}
                                             alt={project.title}
                                             width={500}
                                             height={300}
                                             className="object-cover w-full h-full transition-transform hover:scale-105"
                                          />
                                          <div className="absolute top-2 right-2">
                                             <Badge className="bg-primary/90 hover:bg-primary/90">{project.type}</Badge>
                                          </div>
                                       </div>
                                       <CardHeader className="p-4">
                                          <CardTitle className="text-lg">{project.title}</CardTitle>
                                          <CardDescription className="flex items-center gap-2 mt-1">
                                             <Calendar className="h-4 w-4" />
                                             <span>{project.releaseDate}</span>
                                          </CardDescription>
                                       </CardHeader>
                                       <CardContent className="p-4 pt-0 flex-grow">
                                          <p className="text-sm text-muted-foreground">{project.description}</p>
                                          <div className="flex flex-wrap gap-2 mt-4">
                                             <Badge variant="outline">{project.category}</Badge>
                                             <Badge variant="secondary">
                                                <Clock className="h-3 w-3 mr-1" /> %{project.progress} Tamamlandı
                                             </Badge>
                                          </div>
                                       </CardContent>
                                       <CardFooter className="p-4 pt-0">
                                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                             <Button variant="outline" className="w-full cursor-pointer">
                                                Detaylar
                                             </Button>
                                          </motion.div>
                                       </CardFooter>
                                    </Card>
                                 </motion.div>
                              ))}
                        </motion.div>
                     </TabsContent>

                     <TabsContent value="media" className="space-y-8">
                        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {projects
                              .filter((project) => project.type === "Podcast" || project.type === "Belgesel" || project.type === "YouTube Serisi")
                              .map((project) => (
                                 <motion.div key={project.id} variants={item}>
                                    <Card className="flex flex-col h-full">
                                       <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                                          <Image
                                             src={project.image || "/placeholder.svg"}
                                             alt={project.title}
                                             width={500}
                                             height={300}
                                             className="object-cover w-full h-full transition-transform hover:scale-105"
                                          />
                                          <div className="absolute top-2 right-2">
                                             <Badge className="bg-primary/90 hover:bg-primary/90">{project.type}</Badge>
                                          </div>
                                       </div>
                                       <CardHeader className="p-4">
                                          <CardTitle className="text-lg">{project.title}</CardTitle>
                                          <CardDescription className="flex items-center gap-2 mt-1">
                                             <Calendar className="h-4 w-4" />
                                             <span>{project.releaseDate}</span>
                                          </CardDescription>
                                       </CardHeader>
                                       <CardContent className="p-4 pt-0 flex-grow">
                                          <p className="text-sm text-muted-foreground">{project.description}</p>
                                          <div className="flex flex-wrap gap-2 mt-4">
                                             <Badge variant="outline">{project.category}</Badge>
                                             <Badge variant="secondary">
                                                <Clock className="h-3 w-3 mr-1" /> %{project.progress} Tamamlandı
                                             </Badge>
                                          </div>
                                       </CardContent>
                                       <CardFooter className="p-4 pt-0">
                                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                             <Button variant="outline" className="w-full cursor-pointer">
                                                Detaylar
                                             </Button>
                                          </motion.div>
                                       </CardFooter>
                                    </Card>
                                 </motion.div>
                              ))}
                        </motion.div>
                     </TabsContent>

                     <TabsContent value="education" className="space-y-8">
                        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {projects
                              .filter((project) => project.type === "Online Kurs")
                              .map((project) => (
                                 <motion.div key={project.id} variants={item}>
                                    <Card className="flex flex-col h-full">
                                       <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                                          <Image
                                             src={project.image || "/placeholder.svg"}
                                             alt={project.title}
                                             width={500}
                                             height={300}
                                             className="object-cover w-full h-full transition-transform hover:scale-105"
                                          />
                                          <div className="absolute top-2 right-2">
                                             <Badge className="bg-primary/90 hover:bg-primary/90">{project.type}</Badge>
                                          </div>
                                       </div>
                                       <CardHeader className="p-4">
                                          <CardTitle className="text-lg">{project.title}</CardTitle>
                                          <CardDescription className="flex items-center gap-2 mt-1">
                                             <Calendar className="h-4 w-4" />
                                             <span>{project.releaseDate}</span>
                                          </CardDescription>
                                       </CardHeader>
                                       <CardContent className="p-4 pt-0 flex-grow">
                                          <p className="text-sm text-muted-foreground">{project.description}</p>
                                          <div className="flex flex-wrap gap-2 mt-4">
                                             <Badge variant="outline">{project.category}</Badge>
                                             <Badge variant="secondary">
                                                <Clock className="h-3 w-3 mr-1" /> %{project.progress} Tamamlandı
                                             </Badge>
                                          </div>
                                       </CardContent>
                                       <CardFooter className="p-4 pt-0">
                                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                             <Button variant="outline" className="w-full cursor-pointer">
                                                Detaylar
                                             </Button>
                                          </motion.div>
                                       </CardFooter>
                                    </Card>
                                 </motion.div>
                              ))}
                        </motion.div>
                     </TabsContent>
                  </Tabs>
               </div>
            </section>

            {/* Alt Dekoratif Çizgi */}
            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1 }} viewport={{ once: true }} className="w-full max-w-lg mx-auto">
               <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
            </motion.div>

            {/* Featured Project */}
            <section className="w-full py-10 bg-pattern-paper">
               <div className="container px-4 md:px-6 mx-auto">
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5 }}
                     className="flex flex-col items-center justify-center space-y-4 text-center mb-10"
                  >
                     <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Öne Çıkan Proje</h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">Üzerinde en çok çalıştığım ve heyecan duyduğum proje</p>
                     </div>
                  </motion.div>

                  <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                     <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col items-center space-y-4">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                           <Image src={projects[0].image || "/placeholder.svg"} width={600} height={400} alt="Kayıp Zamanlar" className="object-cover" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                              <div className="text-white">
                                 <Badge className="bg-primary/90 hover:bg-primary/90 mb-2">{projects[0].type}</Badge>
                                 <h3 className="text-xl font-bold">{projects[0].title}</h3>
                                 <p className="text-sm opacity-90">{projects[0].releaseDate}</p>
                              </div>
                           </div>
                        </div>

                        <div className="w-full bg-background rounded-lg p-4 border">
                           <h4 className="font-medium mb-2">İlerleme Durumu</h4>
                           <div className="w-full bg-muted rounded-full h-4 mb-4">
                              <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${projects[0].progress}%` }}
                                 transition={{ duration: 1, delay: 0.5 }}
                                 className="bg-primary h-4 rounded-full"
                              ></motion.div>
                           </div>
                           <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>Başlangıç: Mart 2023</span>
                              <span>Bitiş: {projects[0].releaseDate}</span>
                           </div>
                        </div>
                     </motion.div>

                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                           <h3 className="text-2xl font-bold">{projects[0].title}</h3>
                           <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">{projects[0].category}</Badge>
                              <Badge variant="outline">
                                 <BookOpen className="h-3 w-3 mr-1" /> Yeni Roman
                              </Badge>
                           </div>
                        </div>

                        <p className="text-muted-foreground">{projects[0].longDescription}</p>

                        <div className="space-y-2">
                           <h4 className="font-medium">Kitapta Öne Çıkan Temalar</h4>
                           <ul className="grid gap-2">
                              {projects[0].features.map((feature, index) => (
                                 <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                    className="flex items-start gap-2"
                                 >
                                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                       <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="h-3 w-3 text-primary"
                                       >
                                          <polyline points="20 6 9 17 4 12" />
                                       </svg>
                                    </div>
                                    <span className="text-muted-foreground">{feature}</span>
                                 </motion.li>
                              ))}
                           </ul>
                        </div>

                        <div className="pt-4">
                           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                              <Button className="gap-1 cursor-pointer">
                                 Ön Sipariş Ver <ArrowRight className="h-4 w-4" />
                              </Button>
                           </motion.div>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* Alt Dekoratif Çizgi */}
            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1 }} viewport={{ once: true }} className="w-full max-w-lg mx-auto">
               <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
            </motion.div>

            {/* Other Projects */}
            <section className="w-full py-10 bg-pattern-paper">
               <div className="container px-4 md:px-6 mx-auto">
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5 }}
                     className="flex flex-col items-center justify-center space-y-4 text-center mb-10"
                  >
                     <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Diğer Projelerim</h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">Farklı alanlarda üzerinde çalıştığım projeler</p>
                     </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                        <Card className="flex flex-col h-full">
                           <CardHeader className="pb-2">
                              <div className="flex items-center gap-2 mb-2">
                                 <Mic className="h-5 w-5 text-primary" />
                                 <CardTitle className="text-lg">Podcast Serisi</CardTitle>
                              </div>
                              <CardDescription>Yazarlık ve edebiyat üzerine sohbetler</CardDescription>
                           </CardHeader>
                           <CardContent className="flex-grow">
                              <p className="text-sm text-muted-foreground">Yazarlık serüvenim, ilham kaynaklarım ve yazma teknikleri hakkında konuşacağım podcast serisi yakında yayında.</p>
                           </CardContent>
                           <CardFooter>
                              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
                                 <Button variant="outline" className="w-full">
                                    Bildirim Al
                                 </Button>
                              </motion.div>
                           </CardFooter>
                        </Card>
                     </motion.div>

                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                        <Card className="flex flex-col h-full">
                           <CardHeader className="pb-2">
                              <div className="flex items-center gap-2 mb-2">
                                 <Video className="h-5 w-5 text-primary" />
                                 <CardTitle className="text-lg">Video İçerikler</CardTitle>
                              </div>
                              <CardDescription>YouTube ve belgesel projeleri</CardDescription>
                           </CardHeader>
                           <CardContent className="flex-grow">
                              <p className="text-sm text-muted-foreground">İstanbul'un tarihi ve kültürel dokusunu keşfettiğim belgesel serisi ve dünya edebiyatı üzerine video içerikler.</p>
                           </CardContent>
                           <CardFooter>
                              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
                                 <Button variant="outline" className="w-full">
                                    Abone Ol
                                 </Button>
                              </motion.div>
                           </CardFooter>
                        </Card>
                     </motion.div>

                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                        <Card className="flex flex-col h-full">
                           <CardHeader className="pb-2">
                              <div className="flex items-center gap-2 mb-2">
                                 <BookOpen className="h-5 w-5 text-primary" />
                                 <CardTitle className="text-lg">Yazarlık Atölyesi</CardTitle>
                              </div>
                              <CardDescription>Online eğitim programı</CardDescription>
                           </CardHeader>
                           <CardContent className="flex-grow">
                              <p className="text-sm text-muted-foreground">Yazarlık yolculuğuna başlamak isteyenler için kapsamlı bir online eğitim programı Ekim ayında başlıyor.</p>
                           </CardContent>
                           <CardFooter>
                              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
                                 <Button variant="outline" className="w-full">
                                    Ön Kayıt
                                 </Button>
                              </motion.div>
                           </CardFooter>
                        </Card>
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* Newsletter */}
            <section className="w-full py-10 bg-primary text-primary-foreground">
               <div className="container px-4 md:px-6 mx-auto">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-4 text-center">
                     <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Projelerden Haberdar Olun</h2>
                        <p className="mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">Yeni projelerim hakkında ilk siz haberdar olmak için bültene abone olun.</p>
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

export default ComingSoon;
