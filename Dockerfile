FROM node:18.3.0 AS build-step

WORKDIR /build
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.18-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /build/build /frontend/build
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]