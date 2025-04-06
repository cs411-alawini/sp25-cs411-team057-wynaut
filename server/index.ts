import express, { Request, Response } from "express";
import mysql from "mysql2";

const connection = mysql.createPool({
  host: "34.132.149.78",
  user: "root",
  password: "",
  database: "Wynaut-Database",
});

// connection.connect((err) => {
//   if (err) {
//     throw err;
//   } else {
//     console.log("Connected!");
//   }
// });

const app = express();
const PORT = 3001;
const VM_IP = "35.206.80.119";

app.use(express.json());
app.use(express.urlencoded());

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.listen(PORT, VM_IP, () => {
  console.log(`Server running on localhost:${PORT}`);
});

connection.query(
  "SELECT * FROM Items LIMIT 10;",
  (err: any, results: any, fields: any) => {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);
