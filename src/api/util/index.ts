import Color from "tinycolor2";
import { regexps } from "../constants";
import Canvas from "canvas";
import { ApiError } from "../helpers/Response";

export const checkColor = (str: string) => {
  const color = new Color(str);
  if (!color.isValid()) throw new ApiError(400, `Invalid Color ${str}`);

  return color.toHslString();
};

export const checkImgURL = (str: string) => {
  const match = str.match(regexps.imgLink);

  if (!match) {
    throw new ApiError(400, `Invalid Image URL ${str}`);
  } else {
    return match[0];
  }
};

export const checkBuffer = (buff: Buffer) => {
  try {
    Canvas.loadImage(buff);
    return buff;
  } catch (err) {
    throw new ApiError(400, "Invalid Image Buffer");
  }
};
