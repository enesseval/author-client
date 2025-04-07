import React from "react";

interface MarkdownDisplayProps {
   children: string;
   className?: string;
}

export const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ children, className = "" }) => {
   // A simple function to convert markdown to basic HTML
   const formatMarkdown = (text: string) => {
      if (!text) return { __html: "" };

      let html = text
         // Headers - satır başından başlayan başlıkları doğru şekilde işle
         .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
         .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-2">$1</h2>')
         .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2">$1</h3>')
         // Bold
         .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
         // Italic
         .replace(/\*(.*?)\*/gim, "<em>$1</em>")
         // Links
         .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-500 hover:underline">$1</a>')
         // Lists - her liste öğesini ayrı ayrı işle
         .replace(/^- (.*$)/gim, "<li>$1</li>")
         // Line breaks - paragraflara dönüştür
         .replace(/\n\s*\n/gim, "</p><p>")
         .replace(/\n/gim, "<br />");

      // Listeleri düzgün biçimlendir
      html = html.replace(/<li>([\s\S]*?)<\/li>/gim, (match) => {
         return `<ul class="list-disc ml-6 my-2">${match}</ul>`;
      });

      // Başlangıç ve bitiş için paragraf etiketleri ekle
      html = `<p>${html}</p>`;

      // Birden fazla boş <ul> etiketlerini temizle
      html = html.replace(/<ul class="list-disc ml-6 my-2"><\/ul>/g, "");

      return { __html: html };
   };

   return (
      <div
         className={`markdown-content mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ${className}`}
         dangerouslySetInnerHTML={formatMarkdown(children)}
      />
   );
};
