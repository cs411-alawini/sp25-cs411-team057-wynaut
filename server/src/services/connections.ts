import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "34.132.149.78",
    user: "root",
    password: "",
    database: "Wynaut-Database",
});

console.log("Connected to MySQL database");
export default pool;
