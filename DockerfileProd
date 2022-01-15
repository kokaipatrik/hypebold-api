FROM node:16

ARG hypebold_secret_key
ARG hypebold_mongo_uri
ARG hypebold_admin_key

ENV NODE_ENV production
ENV HYPEBOLD_SECRET_KEY=${hypebold_secret_key}
ENV HYPEBOLD_MONGO_URI=${hypebold_mongo_uri}
ENV HYPEBOLD_ADMIN_KEY=${hypebold_admin_key}

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install @nestjs/cli
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
