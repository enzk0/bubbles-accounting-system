FROM node:22.14.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --verbose

COPY . .

CMD ["npm", "run", "dev"]
