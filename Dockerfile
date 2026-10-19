FROM node:22.17.1-bookworm-slim AS client-build

WORKDIR /build/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

FROM node:22.17.1-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev
COPY server/ ./server/
COPY --from=client-build /build/client/dist ./client/dist

WORKDIR /app/server
EXPOSE 5000
CMD ["node", "server.js"]
