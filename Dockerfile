FROM node:16-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node ./package*.json ./
RUN npm install --omit=dev
COPY --chown=node:node ./dist ./
USER node
EXPOSE 80 443
CMD ["node", "./server/index.js"]