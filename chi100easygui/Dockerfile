FROM nginx:latest
WORKDIR /app
ADD docker/nginx.conf /etc/nginx/conf.d/
COPY dist /app/chi100easy
EXPOSE 8080
