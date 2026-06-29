# EverPoint marketing website — Cloud Run (static Vite SPA + Node server)
# Serves everpoint.ca / www.everpoint.ca.
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_SHOW_APP_ACCESS
ENV VITE_SHOW_APP_ACCESS=$VITE_SHOW_APP_ACCESS

RUN npm run build

FROM node:22-bookworm-slim AS run
WORKDIR /app

ENV NODE_ENV=production \
    PORT=8080

COPY --from=build /app/dist ./dist
COPY scripts/static-server.mjs ./scripts/static-server.mjs

EXPOSE 8080
CMD ["node", "scripts/static-server.mjs"]
