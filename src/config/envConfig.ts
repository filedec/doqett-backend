import dotenv from 'dotenv';

dotenv.config()

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM;


export {
    PORT , 
    DATABASE_URL,
    JWT_SECRET_KEY,
    FRONTEND_URL,
    EMAIL_HOST,
    EMAIL_PASSWORD,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_FROM
}