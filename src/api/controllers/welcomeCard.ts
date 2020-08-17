import { Request, Response } from "express";
import { checkColor, checkImgURL } from "../util";
import { drawCard } from "../canvas/cards/style1";
import { handleError } from "../helpers/Response";

export const postStyle1 = async (req: Request, res: Response) => {
  console.log(req.body);
  const body = req.body;
  const buffer = await drawCard(
    body.guildName ? body.guildName : undefined,
    body.memberName ? body.memberName : undefined,
    body.avatarURL ? checkImgURL(body.avatarURL) : undefined,
    body.backgroundImage ? checkImgURL(body.backgroundImage) : undefined,
    body.profileColor ? checkColor(body.profileColor) : undefined,
    body.backgroundColor ? checkColor(body.backgroundColor) : undefined,
    body.textColor ? checkColor(body.textColor) : body.textColor
  );
  res.end(JSON.stringify(buffer.toJSON()));
};

export const getStyle1 = async (req: Request, res: Response) => {
  const body = req.query;
  try {
  } catch (err) {
    handleError(err, res);
  }
  const buffer = await drawCard(
    typeof body.guildName === "string" && body.guildName
      ? body.guildName
      : undefined,
    typeof body.memberName === "string" && body.memberName
      ? body.memberName
      : undefined,
    typeof body.avatarURL === "string" && body.avatarURL
      ? checkImgURL(body.avatarURL)
      : undefined,
    typeof body.backgroundImage === "string" && body.backgroundImage
      ? checkImgURL(body.backgroundImage)
      : undefined,
    typeof body.profileColor === "string" && body.profileColor
      ? checkColor(body.profileColor)
      : undefined,
    typeof body.backgroundColor === "string" && body.backgroundColor
      ? checkColor(body.backgroundColor)
      : undefined,
    typeof body.textColor === "string" && body.textColor
      ? checkColor(body.textColor)
      : undefined
  );

  res.type("png");
  res.end(buffer);
};
