FROM node:16-alpine
RUN apk add dumb-init
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node ./dist .
COPY --chown=node:node ./package*.json .
RUN npm ci --only=production
USER node
EXPOSE 80
CMD ["dumb-init", "node", "./server/index.js"]