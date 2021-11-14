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

# Copying server and bootloader
COPY bootloader/ /bootloader
COPY server/ /server

# Installing and configuring node process manager
RUN npm install -g pm2
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY process.yml process.yml

EXPOSE 80 4444

CMD ["pm2-runtime", "process.yml"]
