import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


// this will guard a function so that only OTP verified users can access the system
export const requireOtpVerified = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch {
    return res.sendStatus(403);
  }
};
