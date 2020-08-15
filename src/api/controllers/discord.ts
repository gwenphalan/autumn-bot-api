import { Request, Response } from "express";
import fetch from "node-fetch";
import { config } from "../../config";
import { Permissions } from "discord.js";
import { getGuildSettings, updateGuildSettings } from "../../database";
import net from "net";
import { ApiError, ApiResponse } from "../helpers/Response";

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

  const response = await fetch(`https://discordapp.com/api/v6/oauth2/token`, {
    method: "POST",
    body: new URLSearchParams({
      code: `${code}`,
      client_id: config.clientID,
      client_secret: config.clientSecret,
      grant_type: "authorization_code",
      redirect_uri:
        process.env.NODE_ENV === "development"
          ? `http://localhost:4200/api/discord/callback`
          : `https://www.autumnbot.net/api/discord/callback`,
      scope: "identify%20guilds",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response) throw new ApiError(500, "No Discord API Response");

  const expire = new Date(604800000 + Date.now());

  const json = await response.json();

  if (json.access_token)
    res.cookie("access_token", json.access_token, {
      expires: expire,
    });

  return res.redirect(`${config.website}/home`);
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("access_token");

  res.redirect(`${config.website}/home`);
};

export const userinfo = async (req: Request, res: Response) => {
  const access_token = req.cookies.access_token;

  if (!access_token) return res.send(new ApiError(401, "Unauthorized"));

  const response = await fetch(`http://discordapp.com/api/users/@me`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await response.json();

  if (!access_token || data.message === "401: Unauthorized")
    return res.send(new ApiError(401, "Unauthorized"));

  return res.send(new ApiResponse(200, data));
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
    return res.send(new ApiError(401, "Unauthorized"));

  const guilds: userGuild[] = [];

  for (let i = 0; i < data.length; i++) {
    const guild = data[i];

    const permissions = new Permissions(guild.permissions);

    const hasPerm = permissions.has("MANAGE_GUILD");

    const guildSettings = await getGuildSettings(guild.id);

    if (guildSettings) guild.botGuild = true;

    if (hasPerm) guilds.push(guild);
  }

  return res.send(new ApiResponse(200, guilds));
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
    return res.send(new ApiError(401, "Unauthorized"));

  const guilds = data;

  const userGuild = guilds.find((g: any) => g.id === req.params.guild);

  if (!userGuild) return res.send(new ApiError(401, "Unauthorized"));

  const permissions = new Permissions(userGuild.permissions);

  const hasPerm = permissions.has("MANAGE_GUILD");

  const guildSettings = await getGuildSettings(userGuild.id);

  const botGuild = guildSettings ? true : false;

  if (!hasPerm || !botGuild) return res.send(new ApiError(401, "Unauthorized"));

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
    return res.send(new ApiError(401, "Unauthorized"));

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
    return res.send(new ApiError(401, "Unauthorized"));

  guild.channels = channels;

  const settings = await getGuildSettings(req.params.guild);

  if (!settings) return res.send(new ApiError(404, "No Settings Entry Found"));

  guild.settings = settings;

  return res.send(new ApiResponse(200, guild));
};

export const invite = async (req: Request, res: Response) => {
  res.redirect(
    `https://discordapp.com/api/oauth2/authorize?client_id=${
      config.clientID
    }&guild_id=${
      req.params.guild
    }&permissions=1576397911&response_type=code&redirect_uri=${encodeURIComponent(
      `${req.protocol}://${config.host}/api/discord/callback/invite`
    )}&scope=bot%20guilds`
  );
};

export const inviteCallback = async (req: Request, res: Response) => {
  res.redirect(`${config.website}/redirect?guild=${req.query.guild_id}`);
};

export const updateGuild = async (req: Request, res: Response) => {
  const access_token = req.cookies.access_token;

  const response = await fetch(`http://discordapp.com/api/users/@me/guilds`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await response.json();

  if (!access_token || data.message === "401: Unauthorized")
    return res.send(new ApiError(401, "Unauthorized"));

  const guilds = data;

  const userGuild = guilds.find((g: any) => g.id === req.params.guild);

  if (!userGuild) return res.send(new ApiError(401, "Unauthorized"));

  const permissions = new Permissions(userGuild.permissions);

  const hasPerm = permissions.has("MANAGE_GUILD");

  const guildSettings = await getGuildSettings(userGuild.id);

  const botGuild = guildSettings ? true : false;

  if (!hasPerm || !botGuild) return res.send(new ApiError(401, "Unauthorized"));

  if (!req.body.module)
    return res.send(new ApiError(400, "No Module Provided"));

  if (!req.body.settings)
    return res.send(new ApiError(400, "No Settings Provided"));

  await updateGuildSettings(req.params.guild, req.body.settings);

  console.log("Connecting to bot...");

  const client = new net.Socket();

  client.connect({ port: 8124, host: "0.0.0.0" }, () => {
    console.log("Connected to bot.");

    const update = {
      guild: req.params.guild,
      module: req.body.module,
      settings: req.body.settings,
    };
    client.write(JSON.stringify(update));
  });

  client.on("data", function (d) {
    const data = JSON.parse(d.toString());

    if (data.message === "Success") res.send(new ApiResponse(200, data));
    else res.send(new ApiError(data.status, data.message));

    client.end();
  });

  client.on("end", function () {});

  client.on("error", (err) => {
    console.log(err);

    res.send(new ApiError(500, "Internal Server Error"));
  });

  return;
};
