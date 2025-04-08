import express, { Request, Response } from "express";

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
