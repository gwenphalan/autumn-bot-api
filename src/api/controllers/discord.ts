import { Request, Response } from "express";
import fetch from "node-fetch";
import { config } from "../../config";
import { Permissions } from "discord.js";
import { getGuildSettings } from "../../database";
import btoa from "btoa";

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
  const code = req.query.code;
  const creds = btoa(`${config.clientID}:${config.clientSecret}`);
  const response = await fetch(
    `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
      `${req.protocol}://${config.host}/api/discord/callback`
    )}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
      },
    }
  );
  const json = await response.json();

  const expire = new Date(604800000 + Date.now());

  res.cookie("access_token", json.access_token, {
    expires: expire,
  });

  res.redirect(`${config.website}/home`);
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("access_token");

  res.redirect(`${config.website}/home`);
};

export const userinfo = async (req: Request, res: Response) => {
  const access_token = req.cookies.access_token;

  if (!access_token)
    return res.send({
      status: 401,
      message: "UNAUTHORIZED",
      data: undefined,
    });

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

  for (let i = 0; i < data.length; i++) {
    const guild = data[i];

    const permissions = new Permissions(guild.permissions);

    const hasPerm = permissions.has("MANAGE_GUILD");

    const guildSettings = await getGuildSettings(guild.id);

    if (guildSettings) guild.botGuild = true;

    console.log(hasPerm);

    if (hasPerm) guilds.push(guild);

    console.log(guilds);
  }

  return res.send({ status: 200, message: "SUCCESS", data: guilds });
};
