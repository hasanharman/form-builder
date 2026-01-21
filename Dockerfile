# syntax=docker.io/docker/dockerfile:1

FROM node:current-bookworm-slim AS base

# Stage 1: Install dependencies only when needed
FROM base AS deps

# Set the working directory for the app setup
RUN mkdir -p /form-builder-in-docker
WORKDIR /form-builder-in-docker

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* /form-builder-in-docker/
RUN npm install --force

# Stage 2: Build the application's source code only when needed
FROM base AS builder
WORKDIR /form-builder-in-docker
COPY --from=deps /form-builder-in-docker/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# By default, Node.js limits the heap size, which can be insufficient for large Next.js builds. You can increase it by setting the NODE_OPTIONS environment variable:
ENV NODE_OPTIONS=--max-old-space-size=4096

RUN npm run build

# Stage 3: Production server, copy all the files and run next
FROM base AS runner
WORKDIR /form-builder-in-docker

ENV RUNNING_IN_PRODUCTION="true"
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /form-builder-in-docker/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /form-builder-in-docker/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /form-builder-in-docker/.next/static ./.next/static

USER nextjs

EXPOSE 3001
ENV PORT=3001

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]