FROM node:lts-alpine3.14

# Copying server and bootloader
COPY bootloader/ /bootloader
COPY server/ /server

# Installing and configuring node process manager
RUN npm install -g pm2
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY process.yml process.yml

EXPOSE 4444

CMD ["sh", "-c", "pm2-runtime --only server"]
