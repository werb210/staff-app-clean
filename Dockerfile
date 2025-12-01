FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN npm run build

EXPOSE 5000
CMD ["node", "server/dist/index.js"]
