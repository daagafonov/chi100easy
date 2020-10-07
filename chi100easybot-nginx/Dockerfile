FROM nginx

RUN apt update && apt upgrade -y && apt install certbot python-certbot-nginx iputils-ping -y

#RUN certbot --nginx -d agafonov.tech -d www.agafonov.tech


#RUN install_packages git openjdk-8-jdk

#WORKDIR /usr/src/app

#COPY package.json package.json

# This install npm dependencies on the balena build server,
# making sure to clean up the artifacts it creates in order to reduce the image size.
#RUN JOBS=MAX npm install --production --unsafe-perm && npm cache verify && rm -rf /tmp/*

# This will copy all files in our root to the working directory in the container
#COPY . ./

# Enable udevd so that plugged dynamic hardware devices show up in our container.
#ENV UDEV=1

# server.js will run when container starts up on the device
#CMD ["npm", "run", "docker"]

COPY default.conf /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/
COPY proxy.conf /etc/nginx/

EXPOSE 80
EXPOSE 443
