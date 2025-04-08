import express, { Request, Response } from "express";
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "34.132.149.78",
  user: "root",
  password: "",
  database: "Wynaut-Database",
});

connection.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("Connected!");
  }
});

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded());

app.use(express.json());

app.get("/api/", (req: Request, res: Response) => {
  res.send("API");
});

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
