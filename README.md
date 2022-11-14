# game-project

## Database and Environment Variables set-up

You will need to create two .env files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, to initialize the enviroment variable `PGDATABSE` with the correct database name for that environment (see `/db/setup.sql` for the database names).
