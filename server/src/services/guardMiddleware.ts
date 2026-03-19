import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface SessionJwtPayload {
  email: string;
  otpVerified: boolean;
  oauthVerified: boolean;
  googleAccessToken?: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  auth?: SessionJwtPayload;
}

const extractBearerToken = (authHeader?: string) => {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
};

const verifySessionToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as SessionJwtPayload;
};

export const requireOtpVerified = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({
      message: "Invalid authentication token.",
    });
  }

  try {
    const decoded = verifySessionToken(token);

    if (!decoded.otpVerified) {
      return res.status(403).json({
        message: "OTP verification required.",
      });
    }

    (req as AuthenticatedRequest).auth = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Session expired or invalid. Please verify OTP again.",
    });
  }
};

export const requireOtpAndOAuthVerified = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({
      message: "Invalid authentication token.",
    });
  }

  try {
    const decoded = verifySessionToken(token);

    if (!decoded.otpVerified) {
      return res.status(403).json({
        message: "OTP verification required.",
      });
    }

    if (!decoded.oauthVerified) {
      return res.status(403).json({
        message: "Google OAuth verification required.",
      });
    }

    (req as AuthenticatedRequest).auth = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Session expired or invalid. Please verify OTP again.",
    });
  }
};
