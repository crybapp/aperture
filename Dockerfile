FROM node:lts-buster

WORKDIR /usr/src/app
COPY . .

RUN yarn

EXPOSE 9000
EXPOSE 9001

CMD [ "yarn", "start" ]
