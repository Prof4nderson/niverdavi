FROM node:22-alpine

WORKDIR /app
COPY server.mjs ./server.mjs
COPY site ./site

ENV PORT=5173
ENV DATA_DIR=/data
VOLUME ["/data"]
EXPOSE 5173

CMD ["node", "server.mjs"]
