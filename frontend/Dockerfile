FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm serve
RUN pnpm install

COPY . .
RUN pnpm run build

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]