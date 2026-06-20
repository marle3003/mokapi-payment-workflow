FROM node:26-alpine3.23

WORKDIR /app

COPY package.json package-lock.json ./

COPY frontend/package.json ./frontend/

RUN --mount=type=cache,target=/root/.npm npm ci --workspace=frontend

COPY frontend/ ./frontend/

WORKDIR /app/frontend

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

RUN npm install --global serve

EXPOSE 3000

CMD ["serve", "-s", "/app/frontend/dist", "-l", "3000"]