import express from "express";

import { discordRouter, botRouter, cardRouter } from "./routes";

export const api = express();

api.get("/test", (_req, res) => {
  res.end("Success");
});

api.use("/discord", discordRouter);

api.use("/bot", botRouter);

api.use("/cards", cardRouter);
