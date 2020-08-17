import { Request, Response } from "express";
import { BotInfo } from "../../database/schemas/BotInfo";
import { ApiError, ApiResponse } from "../helpers/Response";

let botInfo: BotInfo;
const getBotInfo = async () => {
  const info = await BotInfo.find();

  botInfo = info[0] || undefined;
};

getBotInfo();

setInterval(getBotInfo, 1200000);

export const info = async (_req: Request, res: Response) => {
  if (!botInfo) return res.send(new ApiError(500, "No Bot Info Found"));

  return res.send(new ApiResponse(200, botInfo));
};
