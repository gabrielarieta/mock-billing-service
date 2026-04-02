FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY vite.config.ts ./
COPY src/ src/

RUN npm install -g pnpm
RUN pnpm install

RUN pnpm run build