import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface OtpJwtPayload {
  email: string;
  otpVerified: boolean;
  iat: number;
  exp: number;
}

// this function verifies the OTP whether it is valid or expired

// - reads the authHeader and token
// - return if authentication token is invalid or null
// - decode the jwt using JWT_SECRET and return error if OTP 

export const requireOtpVerified = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Missing authentication token.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid authentication token.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as OtpJwtPayload;

    if (!decoded.otpVerified) {
      return res.status(403).json({
        message: "OTP verification required.",
      });
    }

    // optional: attach user details (like email) to request
    // (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({
      message: "Session expired or invalid. Please verify OTP again.",
    });
  }
};
