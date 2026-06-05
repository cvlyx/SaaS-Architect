FROM node:24-alpine AS base
RUN npm install -g pnpm@latest
WORKDIR /app

# Copy root workspace manifests
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY lib/db/package.json lib/db/package.json
COPY lib/api-zod/package.json lib/api-zod/package.json
COPY lib/api-client-react/package.json lib/api-client-react/package.json
COPY artifacts/api-server/package.json artifacts/api-server/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY lib/db lib/db
COPY lib/api-zod lib/api-zod
COPY lib/api-client-react lib/api-client-react
COPY artifacts/api-server artifacts/api-server

# Build shared libs first, then api-server
RUN pnpm --filter @workspace/db run build 2>/dev/null; true
RUN pnpm --filter @workspace/api-server run build

EXPOSE 3001
CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
