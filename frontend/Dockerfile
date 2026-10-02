FROM nginx:1.27-alpine
COPY index.html kitchen.html qr.html /usr/share/nginx/html/
COPY qr-codes /usr/share/nginx/html/qr-codes
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
