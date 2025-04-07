# Node.js tabanlı bir imaj kullan
FROM node:18-alpine

# Çalışma dizini oluştur
WORKDIR /client

# package.json ve package-lock.json dosyalarını kopyala
COPY package.json package-lock.json ./

# Bağımlılıkları yükle
RUN npm install

# Projeyi kopyala
COPY . .

# Uygulamayı build et
RUN npm run build --no-lint

# Next.js uygulamasını production modda çalıştır
CMD ["npm", "run", "dev"]

# Uygulamanın çalışacağı portu belirt
EXPOSE 3000
