import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import { api } from "./api/";

import { config } from "./config";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/", api);

app.get("/", (req, res) => {
  res.redirect(`${req.protocol}://${config.website}/home`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
