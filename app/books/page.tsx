"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Award, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useBooksContext } from "@/context/BooksContext";
import { useRouter } from "next/navigation";

function Books() {
   const { categories, books } = useBooksContext();
   const router = useRouter();

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
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Kitaplarım</h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                           Tüm eserlerim, hikayelerim ve düşüncelerim. Okuyucularımla paylaştığım dünyalar.
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
                           {/* kategoriler de veritabanından gelecek */}
                           <TabsTrigger value="all">Tüm Kitaplar</TabsTrigger>
                           {categories.map((category) => (
                              <TabsTrigger key={category.id} value={category.name} className="cursor-pointer">
                                 {category.name}
                              </TabsTrigger>
                           ))}
                        </TabsList>
                     </motion.div>

                     <TabsContent value="all" className="space-y-8">
                        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                           {books.map((book) => (
                              <motion.div key={book._id} variants={item}>
                                 <Card className="flex flex-col h-full overflow-hidden py-0 cursor-pointer" onClick={() => router.push(`/books/${book._id}`)}>
                                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                                       <Image
                                          src={book.coverImageUrl || "/placeholder.svg"}
                                          alt={book.title}
                                          width={225}
                                          height={300}
                                          className="object-cover w-full h-full transition-transform hover:scale-105"
                                       />
                                    </div>
                                    <CardHeader className="p-4">
                                       <CardTitle className="text-lg">{book.title}</CardTitle>
                                       <CardDescription className="flex items-center gap-2 mt-1">
                                          <Calendar className="h-4 w-4" />
                                          <span>{book.year}</span>
                                       </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 flex-grow h-[180px] flex flex-col justify-between">
                                       <p className="text-sm text-muted-foreground h-[80px] line-clamp-4">
                                          {book.description.length > 150 ? `${book.description.substring(0, 150)}...` : book.description}
                                       </p>
                                       <div className="flex flex-wrap gap-2 mt-2">
                                          <Badge variant="outline">{book.category.name}</Badge>
                                          {book.awards && book.awards.length > 0 && (
                                             <Badge variant="secondary">
                                                <Award className="h-3 w-3 mr-1" /> Ödüllü
                                             </Badge>
                                          )}
                                       </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                       <Link href={`/books/${book._id}`} className="w-full">
                                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                             <Button variant="outline" className="w-full cursor-pointer">
                                                Detaylar
                                             </Button>
                                          </motion.div>
                                       </Link>
                                    </CardFooter>
                                 </Card>
                              </motion.div>
                           ))}
                        </motion.div>
                     </TabsContent>

                     {categories.map((category) => (
                        <TabsContent key={category.id} value={category.name} className="space-y-8">
                           <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {books
                                 .filter((book) => book.category.name === category.name)
                                 .map((book) => (
                                    <motion.div key={book._id} variants={item}>
                                       <Card className="flex flex-col h-full overflow-hidden py-0 cursor-pointer">
                                          <div className="relative aspect-[3/4] w-full overflow-hidden">
                                             <Image
                                                src={book.coverImageUrl || "/placeholder.svg"}
                                                alt={book.title}
                                                width={225}
                                                height={300}
                                                className="object-cover w-full h-full transition-transform hover:scale-105"
                                             />
                                          </div>
                                          <CardHeader className="p-4">
                                             <CardTitle className="text-lg">{book.title}</CardTitle>
                                             <CardDescription className="flex items-center gap-2 mt-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{book.year}</span>
                                             </CardDescription>
                                          </CardHeader>
                                          <CardContent className="p-4 pt-0 flex-grow h-[180px] flex flex-col justify-between">
                                             <p className="text-sm text-muted-foreground h-[80px] line-clamp-4">
                                                {book.description.length > 150 ? `${book.description.substring(0, 150)}...` : book.description}
                                             </p>
                                             <div className="flex flex-wrap gap-2 mt-2">
                                                <Badge variant="outline">{book.category.name}</Badge>
                                                {book.awards && book.awards.length > 0 && (
                                                   <Badge variant="secondary">
                                                      <Award className="h-3 w-3 mr-1" /> Ödüllü
                                                   </Badge>
                                                )}
                                             </div>
                                          </CardContent>
                                          <CardFooter className="p-4 pt-0">
                                             <Link href={`/books/${book._id}`} className="w-full">
                                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                                   <Button variant="outline" className="w-full cursor-pointer">
                                                      Detaylar
                                                   </Button>
                                                </motion.div>
                                             </Link>
                                          </CardFooter>
                                       </Card>
                                    </motion.div>
                                 ))}
                           </motion.div>
                        </TabsContent>
                     ))}

                     <TabsContent value="other" className="space-y-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center py-12">
                           <h3 className="text-xl font-medium mb-2">Yakında Yeni Kategoriler</h3>
                           <p className="text-muted-foreground">Deneme, makale ve diğer yazılarım yakında bu bölümde yer alacak.</p>
                        </motion.div>
                     </TabsContent>
                  </Tabs>
               </div>
            </section>

            {/* Book Detail Example */}
            {/*<section className="w-full py-10 bg-pattern-paper">
               <div className="container px-4 md:px-6 mx-auto">
                 
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5 }}
                     className="flex flex-col items-center justify-center space-y-4 text-center mb-10"
                  >
                     <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Öne Çıkan Eser</h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">En çok okunan ve sevilen kitabım</p>
                     </div>
                  </motion.div>
                  <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                     <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col items-center space-y-4">
                        <div className="relative aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-lg shadow-lg">
                           <Image src={books[1].cover || "/placeholder.svg"} width={300} height={400} alt="Zamanın İzinde" className="object-cover" />
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 w-full max-w-[300px]">
                           {books[1].buyLinks.map((link, index) => (
                              <Link key={index} href={link.url} className="flex-1 min-w-[100px]">
                                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="outline" size="sm" className="w-full">
                                       <ShoppingCart className="h-4 w-4 mr-2" /> {link.name}
                                    </Button>
                                 </motion.div>
                              </Link>
                           ))}
                        </div>
                     </motion.div>

                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                           <h3 className="text-2xl font-bold">{books[1].title}</h3>
                           <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">{books[1].category}</Badge>
                              <Badge variant="outline">{books[1].year}</Badge>
                              <Badge variant="outline">{books[1].pages} Sayfa</Badge>
                           </div>
                        </div>

                        <p className="text-muted-foreground">{books[1].longDescription}</p>

                        <div className="space-y-2">
                           <div className="flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-muted-foreground" />
                              <span className="font-medium">Yayınevi:</span> {books[1].publisher}
                           </div>
                           <div className="flex items-center gap-2">
                              <BookMarked className="h-5 w-5 text-muted-foreground" />
                              <span className="font-medium">ISBN:</span> {books[1].isbn}
                           </div>
                        </div>

                        {books[1].awards.length > 0 && (
                           <div className="space-y-2">
                              <h4 className="font-medium flex items-center gap-2">
                                 <Award className="h-5 w-5 text-yellow-500" /> Ödüller
                              </h4>
                              <ul className="list-disc list-inside text-muted-foreground">
                                 {books[1].awards.map((award, index) => (
                                    <li key={index}>{award}</li>
                                 ))}
                              </ul>
                           </div>
                        )}

                        <div className="pt-4">
                           <Link href={`/kitaplar/${books[1].id}`}>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                                 <Button className="gap-1">
                                    Detaylı İncele <ArrowRight className="h-4 w-4" />
                                 </Button>
                              </motion.div>
                           </Link>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </section>*/}
         </main>
      </div>
   );
}

export default Books;
