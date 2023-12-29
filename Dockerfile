FROM node:18 as builder

WORKDIR /apps

COPY . .

RUN yarn && NODE_ENV=production yarn build

RUN ls /apps/build

# ===========================================================

FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /apps/build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
