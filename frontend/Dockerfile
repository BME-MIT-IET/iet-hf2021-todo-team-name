FROM node:16.1.0-alpine as build

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# add app
COPY . ./

# build app
RUN yarn build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]