import dotenv from "dotenv";
dotenv.config();
export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = parseInt(process.env.PORT || "5000", 10);
export const JWT_SECRET = process.env.JWT_SECRET || "change_me";
export const APP_URL = process.env.APP_URL || "http://localhost:5000";
export const DATABASE_URL = process.env.DATABASE_URL || "";