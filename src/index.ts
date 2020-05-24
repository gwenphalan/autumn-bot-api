import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import { api } from "./api/";

import { config } from "./config";

const app = express();

app.use((_req, res, next) => {
  res.setHeader("X-Powered-By", "Weebs");

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Xss-Protection", "1; mode=block");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubdomains"
  );
  res.setHeader("Content-Security-Policy", "default-src https:");
  res.setHeader("Referrer-Policy", "no-referrer");

  next();
});

app.enable("trust proxy");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/", api);

app.get("/", (_req, res) => {
  res.redirect(`http://${config.website}/home`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
