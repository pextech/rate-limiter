FROM node

WORKDIR /app/notifications

COPY package.json .

RUN yarn

COPY . .

EXPOSE 8001

CMD yarn; yarn run build; yarn run start