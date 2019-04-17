FROM node:10.15.3-alpine as builder

WORKDIR /app
COPY . .
RUN yarn
RUN yarn run build

FROM nginx:1.15-alpine
WORKDIR /app
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/client /app
EXPOSE 80
