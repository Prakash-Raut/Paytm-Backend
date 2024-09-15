import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT);
export const NODE_ENV = String(process.env.NODE_ENV);
export const ATLAS_DB_URL = String(process.env.ATLAS_DB_URL);
export const CORS_ORIGIN = String(process.env.CORS_ORIGIN);
export const JWT_SECRET = String(process.env.JWT_SECRET);
export const JWT_EXPIRY = String(process.env.JWT_EXPIRY);
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
export const REFRESH_TOKEN_SECRET = String(process.env.REFRESH_TOKEN_SECRET);
export const REFRESH_TOKEN_EXPIRY = String(process.env.REFRESH_TOKEN_EXPIRY);
