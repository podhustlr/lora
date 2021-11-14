FROM node:current-slim as build
RUN mkdir /gen
COPY . /gen/

WORKDIR /gen

# Installing dependencies
RUN npm install -g @quasar/cli
RUN npm ci

# Building
RUN quasar build -m ssr

FROM node:current-slim

# Copying client build artifacts
COPY --from=build /gen/dist/ssr/ /ssr

WORKDIR /ssr

# Installing and configuring node process manager
RUN npm install pm2 -g
COPY package.json /ssr/package.json
COPY package-lock.json /ssr/package-lock.json
RUN npm ci

COPY process.yml /ssr/process.yml

EXPOSE 80

CMD ["pm2-runtime", "/ssr/process.yml", "--only", "client"]
