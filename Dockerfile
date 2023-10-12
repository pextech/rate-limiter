FROM amd64/postgres:latest

COPY create_databases.sql /docker-entrypoint-initdb.d/