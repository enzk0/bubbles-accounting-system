# FROM node:22.14.0-alpine
#
# WORKDIR /app
#
# COPY package*.json ./
#
# RUN npm ci --verbose
#
# COPY . .
#
# RUN npx prisma generate
#
# EXPOSE 3000
#
# CMD ["npm", "start"]

FROM node:22.14.0-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --verbose

COPY backend/ ./
RUN npx prisma generate

CMD ["npm", "start"]
