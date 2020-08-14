import { Router } from "express";
import {
  login,
  callback,
  userinfo,
  logout,
  userguilds,
  invite,
  inviteCallback,
  getguild,
  updateGuild,
} from "../controllers/discord";

const router = Router();

router.get("/callback", callback);

router.get("/callback/invite", inviteCallback);

router.get("/login", login);

router.get("/logout", logout);

router.get("/userinfo", userinfo);

router.get("/userguilds", userguilds);

router.get("/invite/:guild", invite);

router.get("/guild/:guild", getguild);

router.post("/update/:guild/", updateGuild);

export const discordRouter = router;
