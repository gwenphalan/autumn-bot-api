import express from "express";

import { discordRouter } from "./routes";

export const api = express();

api.get("/test", (_req, res) => {
  res.end("Success");
});

api.use("/discord", discordRouter);
