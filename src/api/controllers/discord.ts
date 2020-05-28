import { Request, Response } from "express";
import fetch from "node-fetch";
import { config } from "../../config";
import { Permissions } from "discord.js";
import { getGuildSettings } from "../../database";
import btoa from "btoa";
import net from "net";

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

    if (hasPerm) guilds.push(guild);
  }

  return res.send({ status: 200, message: "SUCCESS", data: guilds });
};

export const getguild = async (req: Request, res: Response) => {
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

    if (hasPerm) guilds.push(guild);
  }

  if (!guilds.find((guild) => (guild.id = req.params.guild)))
    return res.send({
      status: 401,
      message: "UNAUTHORIZED",
      data: undefined,
    });

  const guildResponse = await fetch(
    `http://discordapp.com/api/guilds/${req.params.guild}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bot ${config.token}`,
      },
    }
  );

  const guild = await guildResponse.json();

  if (guild.message === "401: Unauthorized")
    return res.send({
      status: 401,
      message: "UNAUTHORIZED",
      data: undefined,
    });

  const channelResponse = await fetch(
    `http://discordapp.com/api/guilds/${req.params.guild}/channels`,
    {
      method: "GET",
      headers: {
        Authorization: `Bot ${config.token}`,
      },
    }
  );

  const channels = await channelResponse.json();

  if (channels.message === "401: Unauthorized")
    return res.send({
      status: 401,
      message: "UNAUTHORIZED",
      data: undefined,
    });

  guild.channels = channels;

  const settings = await getGuildSettings(req.params.guild);

  if (!settings)
    return res.send({
      status: 400,
      message: "NO_GUILD_SETTINGS",
      data: undefined,
    });

  guild.settings = settings;

  return res.send({ status: 200, message: "SUCCESS", data: guild });
};

export const invite = async (req: Request, res: Response) => {
  res.redirect(
    `https://discordapp.com/api/oauth2/authorize?client_id=${
      config.clientID
    }&guild_id=${
      req.params.guild
    }&permissions=8&response_type=code&redirect_uri=${encodeURIComponent(
      `${req.protocol}://${config.host}/api/discord/callback/invite`
    )}&scope=bot%20guilds`
  );
};

export const inviteCallback = async (req: Request, res: Response) => {
  res.redirect(`${config.website}/redirect?guild=${req.query.guild_id}`);
};

export const updateGuild = async (req: Request, res: Response) => {
  console.log("test");

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

    if (hasPerm) guilds.push(guild);
  }

  if (!guilds.find((guild) => (guild.id = req.params.guild)))
    return res.send({
      status: 401,
      message: "UNAUTHORIZED",
      data: undefined,
    });

  if (!req.body.module || !req.body.settings)
    return res.send({
      status: 400,
      message: "MISSING_ARGS",
      data: undefined,
    });

  const client = new net.Socket();

  client.connect({ port: 8124, host: "51.178.182.144" }, () => {
    console.log("Connected To Bot");
    const update = {
      guild: req.params.guild,
      module: req.body.module,
      settings: req.body.settings,
    };
    client.write(JSON.stringify(update));
  });

  client.on("data", function (d) {
    const data = JSON.parse(d.toString());

    if (data === "SUCCESS")
      res.send({ status: 200, message: "SUCCESS", data: undefined });
    else res.send({ status: 500, message: data, data: undefined });

    client.end();
  });

  client.on("end", function () {
    console.log("Disconnected From Bot");
  });

  return;
};
