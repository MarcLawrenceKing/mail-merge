import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

// middleware to parse JSON body
app.use(express.json());

// test route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello from Express + TypeScript 🚀"
  });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
