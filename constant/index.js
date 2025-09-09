import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });


// CONSTANT
export const PORT=process.env.PORT;
export const DB_URL=process.env.DB_URL;
export const DB_NAME=process.env.DB_NAME;