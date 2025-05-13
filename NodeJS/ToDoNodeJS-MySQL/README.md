## The NodeJS Todo Sample Application

The app is a simple CRUD (Create, read, update, delete) Todo application made with NodeJS.

## How to run?

### Node version

- NodeJS v20.16.0

## Common setup
Copy `.env.sample` to create a `.env` that will be the environment variable for the application. Edit the `.env` file with the correct values.

| Variable Name | Description           | Example Value |
|---------------|-----------------------|----------------|
| `DB_HOST`     | Hostname of the database server | `localhost`     |
| `DB_USER`     | Username used to connect to the database | `test`          |
| `DB_PASSWORD` | Password for the database user   | `test`          |
| `DB_NAME`     | Name of the database             | `test`          |
| `DB_PORT`     | Port number the database is listening on | `3306`          |

```bash
cp .env.sample .env
```
Install node dependencies

```bash
npm install
```

To run express server locally, run the following:

```bash
npm run start
```

App should be accessible here: [http://localhost:3000](http://localhost:3000).

## Build the application ready for production

Step 1: Install the npm packages

```bash
npm install
```

Step 2: Build the application by running this command

```bash
npm run build-prod
```

Step 3: Run the output build

```bash
npm run serve
```

> NOTE: Before running the application make sure that you have a MySQL VM or container running locally to avoid errors.
