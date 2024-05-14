# syntax=docker/dockerfile:1.4
FROM node:20.11.1-alpine3.19 as builder

WORKDIR /app

COPY --link package*.json ./
RUN npm ci

COPY --link .swcrc build.sh ./
COPY --link src ./src
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20.11.1-alpine3.19 as deploy
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV IS_PROD=true
WORKDIR /app
RUN chown node:node .
USER node

COPY --link --chown=node:node package*.json ./
RUN npm ci --omit=dev

COPY --from=builder --chown=node:node /app/out/src /app

ENTRYPOINT ["node"]
CMD ["/app/index.js"]
