FROM node:14-alpine
WORKDIR /app

COPY --chown=node:node package.json yarn.lock ./
RUN yarn

COPY --chown=node:node src ./src
USER node

CMD [ "yarn", "start" ]