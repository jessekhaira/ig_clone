# syntax=docker/dockerfile:1

FROM node:12-alpine

COPY . /usr/src/app
WORKDIR /usr/src/app

EXPOSE 80 9229 9230
#the entire setup, from installing packages in client and backend, and running app
#is encapsulated in production script in npm in root directory
CMD ["npm", "run", "production"]