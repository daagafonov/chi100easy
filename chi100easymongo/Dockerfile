FROM mongo:latest
WORKDIR /
RUN ls -la
RUN echo $PWD
COPY mongo-init.js /docker-entrypoint-initdb.d/mongo-init.js
