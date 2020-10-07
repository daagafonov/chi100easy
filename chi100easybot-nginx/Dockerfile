FROM nginx

RUN apt update && apt upgrade -y && apt install certbot python-certbot-nginx iputils-ping -y

COPY default.conf /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/
COPY proxy.conf /etc/nginx/

EXPOSE 80
EXPOSE 443
