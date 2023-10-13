#  backend API

## Getting Started

1. Clone this repository

   ```bash
   git clone https://github.com/Lino-Inc/rate-limiter.git
   cd rate-limiter

   ```

2. Install the npm packages

   ```bash
   npm install
   ```

   Also install `nodemon` globally, if you don't have it yet.

   ```bash
   npm install -g nodemon
   ```

3. Congfigure environment settings

   Create a file with the following name and location `.env` and copy the contents from `.env.example` into it. Replace the values with your specific configuration. Don't worry, this file is in the `.gitignore` so it won't get pushed to github.

   ```javasscript
    NODE_ENV=development
    PORT=8080

    # Database
    DB_HOST=
    DB_NAME=
    DB_PASSWORD=
    DB_PORT=5432
    DB_USERNAME=
   SENDER_EMAIL_PASSWORD=
   SENDER_EMAIL=
   
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_PHONE_NUMBER=
   
   REDIS_PASSWORD=
   REDIS_HOST=
   REDIS_PORT=
   ```

4. Running the app locally

   Run this command, which is located in npm script in `package.json` file.

   ```bash
   cd notifications
   ```

   ```bash
   npm run dev 
   ```

6. Get your database ready

   Run this command, which is located in npm script


    `create database`
    ``` bash
    npx sequelize-cli db:create
    ```
    `create model and migration`
    ``` bash
    npx sequelize-cli model:generate --name User --attributes firstName:string,
    ```
    `create migration`
    ``` bash
    npx sequelize-cli db:migrate
    ```
    `generating seeds`
    ``` bash
    npx sequelize-cli seed:generate --name sample-users
    ```
     `running seeds`
    ``` bash
    npx sequelize-cli db:seed:all
    ```
