FROM node:16.6.0
RUN apt-get update -y
RUN apt-get install -y net-tools
WORKDIR /app
COPY package.json package-lock.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 80
CMD ["node_modules/.bin/next", "start", "-p", "80"]
