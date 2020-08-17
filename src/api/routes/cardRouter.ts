import { Router } from "express";
import { postStyle1, getStyle1 } from "../controllers/welcomeCard";

export const cardRouter = Router();

cardRouter.post("/style1", postStyle1);

cardRouter.get("/style1.png", getStyle1);

cardRouter.use((_req, res, next) => {
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

// Why tf this shit not working??
// @ts-ignore
