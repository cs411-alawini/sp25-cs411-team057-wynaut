import express, { Request, Response } from "express";

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/api/',
    (req: Request, res: Response) => {
        res.send('API of Website');
    });

app.listen(PORT, 
    ()=>{
        console.log(`Server running on localhost:${PORT}`);
    })