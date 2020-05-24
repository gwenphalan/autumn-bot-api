import { Router } from "express";
import { login, callback, userinfo, logout } from "../controllers/discord";

const router = Router();

router.get("/callback", callback);

router.get("/login", login);

router.get("/logout", logout);

router.get("/userinfo", userinfo);

export const discordRouter = router;
