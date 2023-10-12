import * as dotenv from 'dotenv';

dotenv.config();

export const port = Number(process.env.PORT);
export const db_host = String(process.env.DB_HOST);
export const db_port = Number(process.env.DB_PORT);
export const db_name = String(process.env.DB_NAME);
export const db_user = String(process.env.DB_USER);
export const db_username = String(process.env.DB_USERNAME);
export const db_password = String(process.env.DB_PASSWORD);

export const environment = process.env.NODE_ENV;
export const logDir = process.env.LOG_DIR;
export const senderEmail = String(process.env.SENDER_EMAIL);
export const senderEmailPassword = String(process.env.SENDER_EMAIL_PASSWORD);


export const twilio_phone_number = String(process.env.TWILIO_PHONE_NUMBER);
export const twilio_account_sid = String(process.env.TWILIO_ACCOUNT_SID);
export const twilio_auth_token = String(process.env.TWILIO_AUTH_TOKEN);


export const redis_host = String(process.env.REDIS_HOST);
export const redis_password = String(process.env.REDIS_PASSWORD);
export const redis_port = Number(process.env.REDIS_PORT);


export const daily_cron_schedule_syntax = String(process.env.DAILY_CRON_SCHEDULE_SYNTAX);
