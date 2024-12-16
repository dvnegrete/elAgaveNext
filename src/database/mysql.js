import { createPool } from "mysql2/promise";

export const db = createPool(process.env.DB_URI);
