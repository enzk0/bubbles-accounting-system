# FROM node:22.14.0-alpine as builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --verbose
# COPY . .
# RUN npm run build
#
# FROM nginx:alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
#
# EXPOSE 80

FROM node:22.14.0-alpine as builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci --verbose

COPY frontend/ ./
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

