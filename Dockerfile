FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --force
COPY . ./
RUN npm run build --configuration=production

FROM nginx:1.27-alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/productivity-keeper-client/browser /usr/share/nginx/html

EXPOSE 80
