FROM node:18-alpine3.17 as build

WORKDIR /app
COPY . /app

ENV VITE_API_URL=http://localhost:8080
RUN npm ci
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/
EXPOSE 3000
CMD ["nginx","-g","daemon off;"]