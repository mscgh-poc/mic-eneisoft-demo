# ==========================================
# Stage 1: Build & Dependencies
# ==========================================
FROM node:26-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

# ==========================================
# Stage 2: Minimal Runtime
# ==========================================
FROM node:26-alpine AS runtime

RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules

COPY --chown=appuser:appgroup . .

ARG APP_VERSION=dev
ARG GIT_SHA=local
ARG BUILD_NUMBER=0
ARG BUILD_DATE=unknown
ARG GITHUB_REPOSITORY=local/dev

ENV APP_VERSION=$APP_VERSION \
    GIT_SHA=$GIT_SHA \
    BUILD_NUMBER=$BUILD_NUMBER \
    BUILD_DATE=$BUILD_DATE \
    GITHUB_REPOSITORY=$GITHUB_REPOSITORY \
    NODE_ENV=production \
    APP_ENV=production \
    PORT=3000

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
