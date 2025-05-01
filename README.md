# Group G
This is the official repo for CSCC22 Group G.

## Testing Guide

### Testing Templates

There are templates for test files that can be found in `./backend/templates`. `*.test.js` files should only be used for unit tests and `*.integration.test.js` should only be used for integration tests.

### Running Unit Tests

To run Unit Tests, run the custom `npm` script to execute all test files that contain unit tests:
```
npm run test:unit
```

**NOTE:** Unit Tests should not rely on any external dependencies. If you need the behavior or output of a dependency while unit testing, simulate the behavior of the dependency through mocking.

#### Useful References
- https://vitest.dev/api/
- https://vitest.dev/guide/why
- https://vitest.dev/guide/mocking.html
- https://vitest.dev/guide/

### Running Integration Tests

To run Integration Tests, start all dependencies first such as the docker container for the entire project or the docker container for the testing database. Afterwards, run the custom `npm` script to execute all tests files that contain integration tests:
```
npm run test:integration
```

**NOTE:** Integration Tests test the interaction between the different systems of your application. Be sure to start any dependency that the application or component needs before performing integration testing.

#### Useful References
- https://github.com/ladjs/supertest/blob/master/README.md
- https://www.theodinproject.com/lessons/nodejs-testing-routes-and-controllers
- https://www.theodinproject.com/lessons/node-path-nodejs-testing-database-operations


## Prisma Guide

### Useful Referemces
- https://www.prisma.io/docs/orm/prisma-client/queries/crud
- https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries
- https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing
- https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting
- https://www.prisma.io/docs/orm/prisma-client/queries/computed-fields
- https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance
- https://www.prisma.io/docs/orm/prisma-client/queries/custom-models
- https://www.prisma.io/docs/orm/prisma-client/queries/transactions
- https://www.prisma.io/docs/orm/prisma-client/queries/select-fields
- https://www.prisma.io/docs/orm/prisma-client/queries/excluding-fields
- https://www.prisma.io/docs/orm/prisma-client/queries
- https://www.prisma.io/docs/orm/prisma-client
- https://www.prisma.io/docs

### Prerequisites

#### Directory

To run any of the `prisma` related commands, the current working directory must be in `./backend` directory of the project

#### Docker Containers

The backend contains `docker-compose.yaml` file that specifies a PostgreSQL database container that is used for integration testing purposes. This database must be running in order for `prisma` commands to work.

To start the database container, run the following custom `npm` script:
```
npm run docker:up
```

To stop the database container, run the following custom `npm` script:
```
npm run docker:down
```

To restart the database container, run the following custom `npm` script:
```
npm run docker:restart
```

### Performing a Database Migration

Database Migration is the process of moving data to another database or the process of changing the structure of the database. 

To perform a database migration without applying changes whenever the `prisma.schema` file is changed, the following command will be used:
```
npx prisma migrate dev --create-only --name <name_of_migration_here>
```
- `npx` is a `npm` command that allows you to run npm binaries in the command line
- `prisma` is the command used to run prisma related operations
- `migrate dev` is a `prisma` command/operation that is used to generate and apply migrations. This should only be used in development environments
- `--create-only` tells `prisma` to only generate the migration files and not apply them
- `--name <name_of_migration_here>` specifies the name of the migration for identification purposes _(similar to a commit message)_

The following is a more concrete and practical example of the command _(this will only generate the migration files)_:
```
npx prisma migrate dev --create-only --name init
```

_(this will generate the migration files and apply them to the database)_:
```
npx prisma migrate dev --name init
```

### Deploying Migrations to the Database

To apply the migrations to the database _(without generating any migrations)_, the following command is used:
```
npx prisma migrate deploy
```

This command should run whenever a docker container is first started or is restarted to ensure that the database models are applied to the database.


### Seeding the Database

Seeding is the process of inserting fake, mocked, or dummy data in the database for development and testing purposes.

In this project, the file for seeding the database is located at `./backend/prisma/seed.js`. To seed the database, the following command is used:
```
npx prisma db seed
```

### Generating Intellisense/Autocomplete for Prisma Client

For autocomplete or intellisense to work on a Prisma Client, a client.js file must be generated. To generate a Prisma Client, the following command is used: 
```
npx prisma generate
```
