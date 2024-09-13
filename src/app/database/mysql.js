import { createPool } from "mysql2/promise";
import { config } from "../../config";

export const db = createPool({
  host: config.hostDB,
  user: config.userDB,
  password: config.passDB,
  database: config.nameDB,
  port: config.portDB,
});
