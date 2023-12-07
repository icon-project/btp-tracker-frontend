#FROM node:18-alpine
#WORKDIR /usr/src/app
#COPY package.json ./
#RUN yarn
#COPY . .
#RUN yarn build
#CMD [ "yarn", "start"]
FROM node:18-alpine AS base
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

FROM base AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM base AS runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME 127.0.0.1

CMD ["node", "server.js"]