FROM node:latest as build
WORKDIR /app
COPY . .
ARG VITE_INSTANCE_URL
ARG VITE_SERVER_URL
ARG VITE_COOKIE_DOMAIN
RUN VITE_INSTANCE_URL=$VITE_INSTANCE_URL VITE_SERVER_URL=$VITE_SERVER_URL VITE_COOKIE_DOMAIN=$VITE_COOKIE_DOMAIN
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]
