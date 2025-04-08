"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
   ArrowRight,
   BookOpen,
   Calendar,
   PenTool,
   Quote,
   Award,
   Book,
   Bookmark,
   BookMarked,
   BookText,
   Edit,
   Feather,
   FileText,
   GraduationCap,
   Library,
   Medal,
   ScrollText,
   Star,
   Trophy,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { useAuthor } from "@/context/AuthorContext";
import { MarkdownDisplay } from "@/components/MarkdownDisplay";
import { useEffect, useState } from "react";
import { bookApi } from "@/services/api/bookApi";
import { Book as BookType } from "@/types/types"; // Rename imported Book to avoid conflict
import Loading from "@/components/Loading"; // Assuming Loading component exists
import { useRouter } from "next/navigation";

// Icon listesi tanımı
const iconList = [
   { icon: Book, name: "book" },
   { icon: BookOpen, name: "bookOpen" },
   { icon: BookMarked, name: "bookMarked" },
   { icon: Library, name: "library" },
   { icon: PenTool, name: "penTool" },
   { icon: Feather, name: "feather" },
   { icon: Edit, name: "edit" },
   { icon: FileText, name: "fileText" },
   { icon: ScrollText, name: "scrollText" },
   { icon: BookText, name: "bookText" },
   { icon: GraduationCap, name: "graduationCap" },
   { icon: Award, name: "award" },
   { icon: Trophy, name: "trophy" },
   { icon: Medal, name: "medal" },
   { icon: Star, name: "star" },
   { icon: Bookmark, name: "bookmark" },
];

// Removed hardcoded books array

const comments = [
   {
      comment: "Gölgeler Şehri, İstanbul'u bambaşka bir gözle görmemi sağladı. Karakterler o kadar gerçekçi ki, kitabı bitirdiğimde onları gerçek hayatta tanıyormuşum gibi hissettim.",
      image: "/profile.png",
      name: "Ayşe K.",
      city: "İstanbul",
      stars: 5,
   },
   {
      comment: "Zamanın İzinde, tarihimizi anlamak için muhteşem bir yolculuk. Ahmet Bey'in detaylara verdiği önem ve akıcı anlatımı sayesinde kitabı elimden bırakamadım.",
      image: "/profile.png",
      name: "Mehmet Y.",
      city: "Ankara",
      stars: 4,
   },
   {
      comment: "Sessiz Çığlık, beni derinden etkiledi. Toplumsal sorunları bu kadar etkileyici bir dille anlatan çok az yazar var. Ahmet Yılmaz kesinlikle favorilerim arasında.",
      image: "/profile.png",
      name: "Zeynep T.",
      city: "İzmir",
      stars: 3,
   },
];

const comingSoon = [
   {
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop",
      title: "Yeni Roman: 'Kayıp Zamanlar'",
      desc: "Pandemi döneminde kaybolan zamanları ve değişen insan ilişkilerini konu alan yeni romanım Eylül 2023'te raflarda olacak",
      date: "Çıkış: Eylül 2023",
   },
   {
      image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=1000&auto=format&fit=crop",
      title: 'Podcast Serisi: "Yazarın Dünyası"',
      desc: "Yazarlık serüvenim, ilham kaynaklarım ve yazma teknikleri hakkında konuşacağım podcast serisi yakında yayında.",
      date: "Başlangıç: Ağustos 2023",
   },
];

export default function Home() {
   const { author, isLoading: isLoadingAuthor } = useAuthor(); // Renamed isLoading to avoid conflict
   const [latestBooks, setLatestBooks] = useState<BookType[]>([]);
   const [isLoadingBooks, setIsLoadingBooks] = useState<boolean>(true);
   const router = useRouter();

   useEffect(() => {
      const fetchLatestBooks = async () => {
         setIsLoadingBooks(true);
         try {
            // Fetch only the latest 3 books using the limit parameter
            const response = await bookApi.getBooks(undefined, 3);
            if (response.success && response.data) {
               setLatestBooks(response.data); // API already returns only 3
            } else {
               console.error("Failed to fetch latest books:", response.error || response.message);
               setLatestBooks([]);
            }
         } catch (error) {
            console.error("Error fetching latest books:", error);
            setLatestBooks([]);
         } finally {
            setIsLoadingBooks(false);
         }
      };
      fetchLatestBooks();
   }, []);

   if (isLoadingAuthor) return <Loading />;

   return (
      <main className="flex-1">
         {/* Hero Section */}
         <section id="#" className="relative w-full min-h-[90vh] flex items-center bg-pattern-paper mt-16 py-10">
            <div className="container px-4 md:px-6 relative mx-auto">
               <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-12">
                  {/* Sol kolon başlık ve butonlar */}
                  <div className="flex flex-col items-center lg:items-start gap-12 lg:flex-1 lg:max-w-2xl">
                     {/* Başlık */}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center lg:items-start space-y-6 text-center lg:text-left max-w-3xl order-0"
                     >
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                           <Badge variant="outline" className="inline-flex items-center gap-1 px-4 py-1.5 text-xs rounded-3xl bg-white/50">
                              {author?.title}
                           </Badge>
                        </motion.div>
                        <motion.h1
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.6, delay: 0.3 }}
                           className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
                        >
                           {author?.authorName}
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="text-xl text-muted-foreground leading-relaxed">
                           "{author?.shortBio}"
                        </motion.p>
                     </motion.div>

                     {/* Butonlar ve Rozetler - Masaüstünde Sol Kolonda */}
                     <div className="hidden lg:flex lg:flex-col lg:items-start gap-8 w-full max-w-3xl">
                        <motion.div
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.6, delay: 0.5 }}
                           className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full"
                        >
                           <Link href="/books" className="w-full sm:w-auto">
                              <Button size="lg" className="w-full text-base h-12 px-8">
                                 <BookOpen className="h-5 w-5 mr-2" />
                                 Kitaplarım
                              </Button>
                           </Link>
                           <Link href="/contact" className="w-full sm:w-auto">
                              <Button size="lg" variant="outline" className="w-full text-base h-12 px-8">
                                 İletişime Geç
                              </Button>
                           </Link>
                        </motion.div>

                        {/* Rozetler - Masaüstünde */}
                        <motion.div
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.6, delay: 0.6 }}
                           className="flex items-center gap-4 text-sm text-muted-foreground"
                        >
                           {author?.badges.map((badge) => {
                              // Badge içindeki icon'a göre dinamik component seçimi
                              const BadgeIcon = iconList.find((icon) => icon.name === badge.icon)?.icon || Award;
                              return (
                                 <div key={badge.text} className="flex items-center gap-1">
                                    <BadgeIcon className="h-4 w-4" />
                                    <span>{badge.text}</span>
                                 </div>
                              );
                           })}
                        </motion.div>
                     </div>
                  </div>

                  {/* Sağ Kolon - Resim */}
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative lg:flex-1 order-2">
                     <div className="relative group">
                        <div className="relative h-[500px] w-[350px] sm:h-[600px] sm:w-[400px] overflow-hidden rounded-lg transition-transform duration-500 ease-out transform group-hover:scale-[1.02] mx-auto">
                           <Image
                              src={author?.profileImageUrl || "/profile.png"}
                              alt={"Yazar"}
                              fill
                              className="object-cover transition-transform duration-700 ease-out transform group-hover:scale-105"
                              priority
                              sizes="(max-width: 640px) 350px, 400px"
                           />
                        </div>
                     </div>
                  </motion.div>

                  {/* Butonlar ve Rozetler - Mobilde Resmin Altında */}
                  <div className="flex lg:hidden flex-col items-center gap-8 w-full max-w-3xl order-3">
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center w-full"
                     >
                        <Link href="/books" className="w-full sm:w-auto">
                           <Button size="lg" className="w-full text-base h-12 px-8 cursor-pointer">
                              <BookOpen className="h-5 w-5 mr-2" />
                              Kitaplarım
                           </Button>
                        </Link>
                        <Link href="/contact" className="w-full sm:w-auto">
                           <Button size="lg" variant="outline" className="w-full text-base h-12 px-8 cursor-pointer">
                              İletişime Geç
                           </Button>
                        </Link>
                     </motion.div>

                     {/* Rozetler - Mobilde */}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex items-center gap-4 text-sm text-muted-foreground"
                     >
                        {author?.badges.map((badge) => {
                           // Badge içindeki icon'a göre dinamik component seçimi
                           const BadgeIcon = iconList.find((icon) => icon.name === badge.icon)?.icon || Award;
                           return (
                              <div key={badge.text} className="flex items-center gap-1">
                                 <BadgeIcon className="h-4 w-4" />
                                 <span>{badge.text}</span>
                              </div>
                           );
                        })}
                     </motion.div>
                  </div>
               </div>
            </div>
         </section>

         {/* About Section */}
         <section id="about" className="w-full py-10 bg-pattern-paper">
            <div className="container px-4 md:px-6 mx-auto">
               <div className="flex flex-col items-center justify-center space-y-8 text-center">
                  {/* Dekoratif Başlık ve Ayraç */}
                  <div className="w-full max-w-4xl flex flex-col items-center space-y-4">
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative w-full text-center py-4"
                     >
                        <div className="absolute inset-0 flex items-center">
                           <div className="w-full border-t border-primary/60" />
                        </div>
                        <h2 className="relative inline-block px-8 py-2 bg-muted/30 text-4xl font-bold tracking-tighter sm:text-5xl uppercase">HAKKIMDA</h2>
                     </motion.div>
                  </div>

                  {/* İçerik */}
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="relative w-full max-w-4xl mx-auto">
                     {author?.longBio && <MarkdownDisplay>{author.longBio}</MarkdownDisplay>}
                     <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                           <Image
                              src={author?.bioImageUrl || "/profile.png"}
                              width={600}
                              height={400}
                              alt="Çalışma Masası"
                              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                           />
                        </motion.div>
                        <motion.div
                           initial={{ opacity: 0, x: 30 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           transition={{ duration: 0.8, delay: 0.2 }}
                           viewport={{ once: true }}
                           className="flex flex-col justify-center space-y-4"
                        >
                           <ul className="grid gap-6">
                              {author?.bioParagraphs.map((bioParagraph) => (
                                 <li key={bioParagraph.title}>
                                    <div className="grid gap-1">
                                       <h3 className="text-xl font-bold">{bioParagraph.title}</h3>
                                       <p className="text-muted-foreground">{bioParagraph.content}</p>
                                    </div>
                                 </li>
                              ))}
                           </ul>
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

         {/* Featured Books */}
         <section id="featured-books" className="w-full py-10 bg-pattern-paper">
            <div className="container px-4 md:px-6 mx-auto">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                     <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Son Kitaplarım</h2>
                     <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">En son eklenen kitaplarıma göz atın.</p>
                  </div>

                  <motion.div
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     transition={{ duration: 0.8 }}
                     viewport={{ once: true }}
                     className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 min-h-[300px]" // Added min-h for loading state
                  >
                     {isLoadingBooks ? (
                        <div className="col-span-full flex justify-center items-center">
                           <Loading /> {/* Or use a simple text like <p>Kitaplar yükleniyor...</p> */}
                        </div>
                     ) : latestBooks.length > 0 ? (
                        latestBooks.map((book) => (
                           <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              viewport={{ once: true }}
                              whileHover={{ y: -10 }}
                              className="flex flex-col items-center space-y-4 cursor-pointer"
                              key={book._id} // Use book._id from DB
                              onClick={() => router.push(`/books/${book._id}`)}
                           >
                              <div className="relative aspect-[3/4] w-full     overflow-hidden rounded-lg shadow-md">
                                 {/* Use book.coverImageUrl, provide fallback */}
                                 <Image src={book.coverImageUrl || "/profile.png"} fill alt={book.title} className="object-cover" />
                              </div>
                              <div className="space-y-2 text-center">
                                 <h3 className="font-bold">{book.title}</h3>
                                 {/* Use book.shortDescription or slice book.description */}
                                 <p className="text-sm text-muted-foreground">{book.description?.substring(0, 100) + (book.description && book.description.length > 100 ? "..." : "")}</p>
                                 <div className="flex justify-center gap-2">
                                    {/* Assuming category is populated or use categoryId */}
                                    {book.category && <Badge>{typeof book.category === "object" ? book.category.name : book.category}</Badge>}
                                    {/* Assuming year exists */}
                                    {book.year && <Badge variant="outline">{book.year}</Badge>}
                                 </div>
                                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link href={`/books/${book._id}`}>
                                       <Button variant="outline" size="sm" className="mt-2 cursor-pointer">
                                          Detaylar
                                       </Button>
                                    </Link>
                                 </motion.div>
                              </div>
                           </motion.div>
                        ))
                     ) : (
                        <div className="col-span-full flex justify-center items-center">
                           <p>Henüz kitap eklenmemiş.</p>
                        </div>
                     )}
                  </motion.div>
               </motion.div>
            </div>
         </section>

         {/* Alt Dekoratif Çizgi */}
         <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1 }} viewport={{ once: true }} className="w-full max-w-lg mx-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
         </motion.div>

         {/* Testimonials */}
         <section id="testimonials" className="w-full py-10 bg-pattern-paper">
            <div className="container px-4 md:px-6 mx-auto">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center justify-center space-y-4 text-center"
               >
                  <div className="space-y-2">
                     <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Okuyucu Yorumları</h2>
                     <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">Kitaplarım hakkında okuyucularımın düşünceleri</p>
                  </div>
                  <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {comments.map((comment) => (
                        <motion.div
                           initial={{ opacity: 0, y: 30 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.5, delay: 0.1 }}
                           viewport={{ once: true }}
                           whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(166, 123, 91, 0.2)" }}
                           className="flex flex-col justify-between rounded-lg border bg-card p-6 shadow-sm"
                           key={comment.name}
                        >
                           <div className="space-y-4">
                              <div className="flex items-center gap-1">
                                 {Array(comment.stars).map((star) => (
                                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-yellow-500">
                                       <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                 ))}
                              </div>
                              <blockquote className="text-sm leading-relaxed">{comment.comment}</blockquote>
                           </div>
                           <div className="mt-6 flex items-center gap-4">
                              <div className="rounded-full bg-muted p-1">
                                 <Image src={comment.image} width={40} height={40} alt={comment.name} className="rounded-full max-w-[40px] max-h-[40px] object-cover" />
                              </div>
                              <div>
                                 <p className="text-sm font-medium">{comment.name}</p>
                                 <p className="text-xs text-muted-foreground">{comment.city}</p>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }} className="mt-8">
                     <Link href="/testimonials">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                           <Button variant="outline" className="gap-1 cursor-pointer">
                              Tüm Yorumları Gör <ArrowRight className="h-4 w-4" />
                           </Button>
                        </motion.div>
                     </Link>
                  </motion.div>
               </motion.div>
            </div>
         </section>

         {/* Alt Dekoratif Çizgi */}
         <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1 }} viewport={{ once: true }} className="w-full max-w-lg mx-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
         </motion.div>

         {/* Coming Soon */}
         <section id="coming-soon" className="w-full py-10 bg-pattern-paper">
            <div className="container px-4 md:px-6 mx-auto">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center justify-center space-y-4 text-center"
               >
                  <div className="space-y-2">
                     <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Yakında</h2>
                     <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">Üzerinde çalıştığım yeni projeler</p>
                  </div>
                  <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 md:gap-12">
                     {comingSoon.map((project) => (
                        <motion.div
                           initial={{ opacity: 0, x: -30 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           transition={{ duration: 0.6, delay: 0.1 }}
                           viewport={{ once: true }}
                           whileHover={{ y: -5 }}
                           className="flex flex-col items-center space-y-4"
                           key={project.title}
                        >
                           <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
                              <Image src={project.image} width={500} height={300} alt={project.title} className="object-center" />
                           </div>
                           <div className="space-y-2 text-center">
                              <h3 className="font-bold">{project.title}</h3>
                              <p className="text-sm text-muted-foreground">{project.desc}</p>
                              <Badge>{project.date}</Badge>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </motion.div>
            </div>
         </section>

         {/* Newsletter */}
         <section className="w-full py-10 bg-primary text-primary-foreground">
            <div className="container px-4 md:px-6 mx-auto">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
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
                           className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
   );
}
