FROM node:26-alpine3.23

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY backend/ ./backend/

WORKDIR /app/backend

EXPOSE 3000

CMD ["index.ts"]