FROM nginx:latest
WORKDIR /app
ADD docker/nginx.conf /etc/nginx/conf.d/
COPY dist /app
EXPOSE 8080
