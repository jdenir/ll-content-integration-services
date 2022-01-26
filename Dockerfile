FROM node:12.11.1-alpine

# Create app directory
RUN mkdir /workspace
WORKDIR /workspace
COPY package.json /workspace
COPY tsconfig.build.json /workspace


RUN npm install -g @types/node typescript ts-loader @nestjs/cli compression @nestjs/core @nestjs/common rxjs reflect-metadata
RUN npm install --silent
RUN npx -p @nestjs/cli nest build

# Bundle app source
COPY . .
EXPOSE 3000
CMD [ "node", "dist/main" ] 