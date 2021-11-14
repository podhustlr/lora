FROM node:current-slim as build
RUN mkdir /gen
COPY . /gen/

WORKDIR /gen

# Installing dependencies
RUN npm install -g @quasar/cli
RUN npm ci

# Building
RUN quasar build -m ssr

FROM node:lts-alpine3.14

# Copying client build artifacts
COPY --from=build /gen/dist/ssr/ /ssr

# Installing and configuring node process manager
RUN npm install -g pm2
RUN npm install

COPY process.yml process.yml

EXPOSE 80

CMD ["pm2-runtime", "process.yml", "--only", "client"]
