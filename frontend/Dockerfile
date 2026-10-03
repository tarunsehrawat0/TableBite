FROM nginx:1.27-alpine
ENV BACKEND_HOST=backend
ENV BACKEND_PORT=3000
COPY index.html kitchen.html qr.html /usr/share/nginx/html/
COPY qr-codes /usr/share/nginx/html/qr-codes
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
