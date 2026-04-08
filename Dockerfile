FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates curl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
RUN git clone --depth 1 https://github.com/paperclipai/paperclip.git . \
  && pnpm install --frozen-lockfile \
  && pnpm build

RUN mkdir -p /paperclip && chown -R node:node /paperclip

ENV PORT=3100
ENV SERVE_UI=true
ENV NODE_ENV=production

EXPOSE 3100

USER node
CMD ["node", "server/dist/index.js"]
