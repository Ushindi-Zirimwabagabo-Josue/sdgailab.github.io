# Multi-stage image for local preview / CI smoke of the static Astro build.
# Production traffic is served from GitHub Pages (see docs/deployment-runtime.md).
# This image is optional and is not used by .github/workflows/deploy.yml.

FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG PUBLIC_SUPABASE_URL=
ARG PUBLIC_SUPABASE_ANON_KEY=
ARG GITHUB_PAGES_BASE=/
ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL \
    PUBLIC_SUPABASE_ANON_KEY=$PUBLIC_SUPABASE_ANON_KEY \
    GITHUB_PAGES_BASE=$GITHUB_PAGES_BASE
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY docker/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html \
  && chown -R nginx:nginx /var/cache/nginx \
  && chown -R nginx:nginx /var/log/nginx \
  && touch /var/run/nginx.pid \
  && chown nginx:nginx /var/run/nginx.pid
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
