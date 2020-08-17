import { Router } from "express";
import { info } from "../controllers/botinfo";

const router = Router();

router.get("/info", info);

export const botRouter = router;
