FROM node:latest

RUN apt update -y && apt install openjdk-8-jdk -y

WORKDIR /usr/src/app

ARG JAR_FILE="chi100easyapi-0.0.1-SNAPSHOT.jar"

ADD package.json package.json


ADD target/$JAR_FILE application.jar

# This install npm dependencies on the balena build server,
# making sure to clean up the artifacts it creates in order to reduce the image size.
#RUN JOBS=MAX npm install --production --unsafe-perm && npm cache verify && rm -rf /tmp/*

# This will copy all files in our root to the working directory in the container
COPY . ./

# Enable udevd so that plugged dynamic hardware devices show up in our container.
#ENV UDEV=1

# server.js will run when container starts up on the device
CMD ["npm", "start"]
