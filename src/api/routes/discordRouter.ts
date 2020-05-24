import { Router } from "express";
import {
  login,
  callback,
  userinfo,
  logout,
  userguilds,
} from "../controllers/discord";

const router = Router();

router.get("/callback", callback);

router.get("/login", login);

router.get("/logout", logout);

router.get("/userinfo", userinfo);

router.get("/userguilds", userguilds);

export const discordRouter = router;
