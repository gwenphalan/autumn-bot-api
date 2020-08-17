import Canvas from "canvas";
import Color from "color";
import path from "path";
import { words } from "../../constants";

import { roundRect, applyText } from "../util";

Canvas.registerFont(
  path.join(__dirname, "../../../../assets/fonts/Poppins-Regular.ttf"),
  { family: "Poppins", style: "Regular", weight: "400" }
);
Canvas.registerFont(
  path.join(__dirname, "../../../../assets/fonts/Poppins-Thin.ttf"),
  { family: "Poppins", style: "Thin", weight: "100" }
);
Canvas.registerFont(
  path.join(__dirname, "../../../../assets/fonts/Poppins-Bold.ttf"),
  { family: "Poppins", style: "Bold", weight: "700" }
);
Canvas.registerFont(
  path.join(__dirname, "../../../../assets/fonts/Poppins-Light.ttf"),
  { family: "Poppins", style: "Light", weight: "300" }
);

const defaultBack = path.join(
  __dirname,
  "../../../../assets/images/autumn-forest.jpg"
);

export const drawCard = async (
  guildName?: string,
  memberName?: string,
  avatarURL?: string,
  backgroundI?: string,
  profileC?: string,
  backgroundC?: string,
  textC?: string
) => {
  const t = 5; // * X Offset of profile picture
  const i = 180; // * Profile Picture Size
  const v = 30; // * Margin between text and pfp/side of image
  const z = 10; // * Space between server name and username
  const x = 250; // * width of pfp area
  const o = 40; // * Base font size for server name
  const u = 100; // * Base font size for member name
  const width = 750; // * width of card
  const height = 300; // * height of card

  const Background = await Canvas.loadImage(backgroundI || defaultBack);

  const canvas = Canvas.createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const profileColor = Color(profileC || "#eb4034").hex();
  const profileColorDark = Color(profileC || "#eb4034")
    .darken(0.6)
    .hex();

  const backgroundColor = Color(backgroundC || "#2b2929").hex();
  const textColor = Color(textC || "#FFF").hex();

  ctx.strokeStyle = backgroundColor;
  ctx.fillStyle = backgroundColor;
  roundRect(ctx, 0, 0, canvas.width, canvas.height, 25, true, true);

  const w = canvas.width;
  const y = x + v;

  const p = w - y;

  const textWidth = p - 50;

  const adjective =
    words.adjectives[Math.floor(Math.random() * words.adjectives.length)];
  const noun = words.nouns[Math.floor(Math.random() * words.nouns.length)];

  const city = words.cities[Math.floor(Math.random() * words.cities.length)];

  const c = `Welcome to ${
    guildName || city.substr(0, 1).toUpperCase() + city.substr(1)
  },`;
  const d = `${
    memberName ||
    (
      adjective.substr(0, 1).toUpperCase() +
      adjective.substr(1) +
      " " +
      noun.substr(0, 1).toUpperCase() +
      noun.substr(1)
    ).replace(/\s/g, " ")
  }!`;

  const a = applyText(canvas, c, "Poppins Regular", o, textWidth);
  const b = applyText(canvas, d, "Poppins Thin", u, textWidth);
  // Slightly smaller text placed above the member's display name

  const e = canvas.height;
  const f = (e - a.size + b.size) / 2;
  const g = e - f + b.size + z / 2;
  const h = e - f - z / 2;

  ctx.textAlign = "center";

  ctx.font = a.font;
  ctx.fillStyle = textColor;
  ctx.fillText(c, y + textWidth / 2, h);

  // Add an exclamation point here and below
  ctx.font = b.font;
  ctx.fillStyle = textColor;
  ctx.fillText(d, y + textWidth / 2, g);

  const gradient = ctx.createRadialGradient(
    0,
    canvas.height / 2,
    x - 20,
    0,
    canvas.height / 2,
    x
  );
  gradient.addColorStop(0, profileColorDark);
  gradient.addColorStop(0.9, profileColor);

  ctx.strokeStyle = profileColorDark;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, canvas.height / 2, x, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();

  ctx.save();

  ctx.beginPath();
  ctx.arc(0, canvas.height / 2, x - 20, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const dw = Background.width * (canvas.height / Background.height);
  const dh = canvas.height;

  const dx = -(dw - x - 20) / 2;

  ctx.drawImage(Background, dx, 0, dw, dh);

  const j = canvas.height;

  const k = (j - i) / 2;
  const l = x - 20;
  const m = (l - i) / 2;
  const n = m - t;

  const q = l / 2 - t;
  const r = j / 2;
  const s = i / 2;

  ctx.fillStyle = "#2b2929";
  ctx.strokeStyle = "#2b2929";

  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetX = 0;

  ctx.shadowColor = "#000";
  ctx.shadowBlur = 8;

  ctx.beginPath();
  ctx.arc(q, r, s, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;

  ctx.beginPath();
  ctx.arc(q, r, s, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(
    avatarURL ||
      `https://cdn.discordapp.com/embed/avatars/${Math.floor(
        Math.random() * 4
      )}.png`
  );
  ctx.drawImage(avatar, n, k, i, i);

  return canvas.toBuffer();
};
