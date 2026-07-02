# Infinibay frontend — multi-stage image (Next.js 16).
#
#   target: dev   Hot-reload development (next dev, HMR). No source baked in; the
#                 lxd dev stack bind-mounts this repo and runs the entrypoint.
#                   build.context = this repo, target = dev   (see ../lxd)
#
#   target: prod  Compiled image (next build → next start). Build from a context
#                 where the @infinibay/harbor submodule (file:./harbor) is
#                 populated, and pass the public URLs as build args (they are
#                 baked into the browser bundle):
#                   docker build --target prod \
#                     --build-arg NEXT_PUBLIC_BACKEND_HOST=https://app.example.com \
#                     --build-arg NEXT_PUBLIC_GRAPHQL_API_URL=https://app.example.com/graphql \
#                     -t infinibay/frontend .

FROM docker.io/library/node:20-bookworm AS base
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl ca-certificates bash git \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /workspace/frontend
ENV HUSKY=0

# ── dev: environment only; source is mounted at runtime ──────────────────────
FROM base AS dev
# Real command comes from the lxd compose stack (docker/entrypoint-frontend.sh).
CMD ["bash", "-lc", "echo 'Run via the lxd dev stack (see ../lxd)'; sleep infinity"]

# ── prod: compiled image (NEXT_PUBLIC_* are baked here, at build time) ────────
FROM base AS prod
ARG NEXT_PUBLIC_BACKEND_HOST=http://localhost:4000
ARG NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:4000/graphql
ENV NEXT_PUBLIC_BACKEND_HOST=$NEXT_PUBLIC_BACKEND_HOST
ENV NEXT_PUBLIC_GRAPHQL_API_URL=$NEXT_PUBLIC_GRAPHQL_API_URL
COPY . /workspace/frontend
# @infinibay/harbor is a file:./harbor submodule; the build fails without it.
RUN test -f harbor/package.json || { echo 'ERROR: harbor submodule not populated in build context'; exit 1; }
RUN npm install --minimum-release-age=0 --no-audit --no-fund
RUN npm run build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start"]
