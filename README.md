# Group G
This is the official repo for CSCC22 Group G.

## Prisma Guide

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
