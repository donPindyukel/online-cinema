FROM node:16.20 AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:16.20-slim

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json /app/yarn.lock ./

RUN yarn install --production

EXPOSE 4200

CMD ["node", "dist/main.js"]