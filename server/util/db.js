import "dotenv/config";
import mysql from "mysql";

export const db = mysql.createConnection({
  host: process.env.HOST,
  user: "root",
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.log(err.message);
  }
});
