import express from "express";

import { discordRouter } from "./routes";

export const api = express();

api.use("/discord", discordRouter);
