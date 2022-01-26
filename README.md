# LEX Learning Content Integration Services

Content Integration Service is a api has the responsibility to get activities
info from Lex Content and save relations for answers type

## Technology

Queue Services is a RESTful API using Node.js with the Nest.js.

## Installation

### 1. Copy the `.env.example` file to `.env`

```bash
$ cp .env.example > .env
```

### 2. Update the contents of the env file

```
HTTP_PORT=3008
SECRET_KEY=
LL_CMS_URL=https://cms.api.dev.ll.lex.conexia.com.br
LEX_CONTENT_API=https://prod-content-service.k8s.content.conexia.com.br
REDIS_HOST=localhost
REDIS_PORT=6379
LESSON_TIME_EXPIRATION=3000

```

### 3. Install dependencies

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
$ npm run test
```

## Documentation

# test coverage

\$ npm run test:cov
You can access the route documentation through `http://YOUR_HOST/api`

## Directory Structure

```
├── /src
|   ├── /app
|   |   |── /answer-type
|   |   |  |── /dto
|   |   |  |── /interface
|   ├── /auth
|   ├── /constant
|   ├── /filter
|   ├── /helper
```
