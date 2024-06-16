FROM node:lts-alpine as build-stage
WORKDIR /src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine-slim
COPY --from=build-stage /src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]