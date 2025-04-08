import express, { Request, Response } from "express";
import * as relation from "./models";

const app = express();
const PORT: number = 3001;

app.use(express.json());

app.get("/api/", (req: Request, res: Response) => {
    res.send("API");
});

app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});
