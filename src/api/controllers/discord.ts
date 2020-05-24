import { Request, Response } from "express";
import fetch from "node-fetch";
import { config } from "../../config";
import { Permissions } from "discord.js";
import { getGuildSettings } from "../../database";

export const login = async (req: Request, res: Response) => {
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${
      config.clientID
    }&redirect_uri=${encodeURIComponent(
      `${req.protocol}://${config.host}/api/discord/callback`
    )}&response_type=code&scope=guilds%20identify`
  );
};

export const callback = async (req: Request, res: Response) => {
  res.redirect(`${config.website}/home`);
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("access_token");

  res.redirect(`${config.website}/home`);
};

export const userinfo = async (req: Request, res: Response) => {
  const access_token = req.cookies.access_token;

  const response = await fetch(`http://discordapp.com/api/users/@me`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await response.json();

  if (!access_token || data.message === "401: Unauthorized")
    return res.send({
      status: 401,
      message: "UNAUTHORIZED",
      data: undefined,
    });

  return res.send({ status: 200, message: "SUCCESS", data: data });
};

type Snowflake = string;

interface userGuild {
  id: Snowflake;
  name: string;
  icon: string;
  owner?: boolean;
  botGuild?: boolean;
  permissions: number;
}

export const userguilds = async (req: Request, res: Response) => {
  const access_token = req.cookies.access_token;

  const response = await fetch(`http://discordapp.com/api/users/@me/guilds`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await response.json();

  if (!access_token || data.message === "401: Unauthorized")
    return res.send({
      status: 401,
      message: "UNAUTHORIZED",
      data: undefined,
    });

  const guilds: userGuild[] = [];

  data.forEach(async (guild: userGuild) => {
    const permissions = new Permissions(guild.permissions);

    const guildSettings = await getGuildSettings(guild.id);

    if (guildSettings) guild.botGuild = true;

    if (permissions.has("MANAGE_GUILD")) guilds.push(guild);
  });

  return res.send({ status: 200, message: "SUCCESS", data: data });
};
