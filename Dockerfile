FROM node:16-alpine
RUN apk add dumb-init
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node ./package*.json .
RUN npm ci --only=production
COPY --chown=node:node ./dist .
USER node
EXPOSE 80 443
CMD ["dumb-init", "node", "./server/index.js"]