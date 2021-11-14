FROM node:current-slim

WORKDIR /usr/app

# Copying server and bootloader
COPY bootloader/ /usr/app/bootloader
COPY server/ /usr/app/server

# Installing and configuring node process manager
RUN npm install pm2 -g
COPY package.json /usr/app/package.json
COPY package-lock.json /usr/app/package-lock.json
RUN npm ci

COPY process.yml /usr/app/process.yml

EXPOSE 4444

CMD ["pm2-runtime", "/usr/app/process.yml", "--only", "server"]
