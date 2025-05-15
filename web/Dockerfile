FROM node:20-alpine as build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY web/package*.json ./

# Instalar dependências
RUN npm install --legacy-peer-deps

# Copiar o código fonte
COPY web/ ./

# Construir a aplicação para produção
RUN npm run build -- --configuration production

# Imagem final baseada em NGINX
FROM nginx:alpine

# Copiar os arquivos de build para o NGINX
COPY --from=build /app/dist/web/browser /usr/share/nginx/html

# Configuração simplificada do NGINX para o container
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]