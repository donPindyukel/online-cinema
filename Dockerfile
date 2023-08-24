FROM node:16.20-alpine3.17 as builder

ENV NODE_ENV build

WORKDIR /opt/app

COPY . /opt/app

RUN yarn install
RUN yarn build


# ---

FROM node:16.8-alpine3.11

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder /opt/app/yarn*.json /opt/app/
COPY --from=builder /opt/app/node_modules/ /opt/app/node_modules/
COPY --from=builder /opt/app/dist/ /opt/app/dist/

CMD ["node", "dist/main.js"]