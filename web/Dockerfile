FROM node:20-alpine as build

WORKDIR /app

COPY web/package*.json ./
RUN npm install --legacy-peer-deps
COPY web/ ./

RUN npm run build -- --configuration production

FROM nginx:alpine

COPY --from=build /app/dist/web/browser /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]