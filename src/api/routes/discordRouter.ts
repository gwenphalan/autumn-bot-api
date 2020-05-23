import { Router } from "express";
import { login, callback, userinfo, logout } from "../controllers/discord";

export const discordRouter = Router();

discordRouter.get("/login", login);

discordRouter.get("/logout", logout);

discordRouter.get("/callback", callback);

discordRouter.get("/userinfo", userinfo);
