FROM node:12

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY app.js app.properties /app/

ENTRYPOINT [ "node", "app.js" ]