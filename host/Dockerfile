FROM node:10.15.3-alpine as builder

WORKDIR /app
COPY . .
RUN yarn install && yarn run build

FROM node:10.15.3-alpine
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY package.json yarn.lock /app/
RUN yarn install --prod
EXPOSE 3000

CMD [ "yarn", "run", "start:prod" ]
