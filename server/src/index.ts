import dotenv from "dotenv";
dotenv.config(); // load .env into process.env

import { Request, Response } from "express";

import app from "./app";

const PORT = process.env.PORT || 3000;

// test route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello from Express + TypeScript 🚀"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
