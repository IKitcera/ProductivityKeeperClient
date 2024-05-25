FROM node:20 AS frontend
EXPOSE 4201
EXPOSE 4201
WORKDIR /app/ProductivityKeeperClient
COPY package*.json ./
RUN npm install --force
RUN npm install -g @angular/cli
COPY . ./
RUN npm run build --prod
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4201"]
