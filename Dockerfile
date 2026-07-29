FROM node:22-alpine AS base
# corepack activa el pnpm pineado en package.json ("packageManager"): builds reproducibles.
RUN corepack enable

FROM base AS deps
WORKDIR /app
# Manifiesto + lock + config de workspace (overrides/allowBuilds viven en
# pnpm-workspace.yaml y .npmrc; sin ellos --frozen-lockfile falla por
# ERR_PNPM_LOCKFILE_CONFIG_MISMATCH). Solo estos → cachea deps si no cambian.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
RUN mkdir -p ./public
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
