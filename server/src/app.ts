import express from "express";
import routes from "./routes";

const app = express();

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL || "",
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());

const redirectGoogleCallbackToAuth = (req: express.Request, res: express.Response) => {
  const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  return res.redirect(`/api/auth/google/callback${query}`);
};

app.get("/oauth/google/callback", redirectGoogleCallbackToAuth);

app.use("/api", routes);

export default app;
