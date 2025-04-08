import express, { Request, Response } from "express";
import bodyParser, { json } from "body-parser";
import axios from "axios";
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

app.get("/api/", (req: Request, res: Response) => {
    res.send("API");
});

app.get("/AddReceipt", (req: Request, res: Response) => {
    res.send("hello");
});

app.put("/AddReceipt", (req: Request, res: Response) => {
    console.log(req.body);
    res.send("accepted");
});

app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});
