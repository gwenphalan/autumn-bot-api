import mongoose from "mongoose";
import { PermissionString } from "discord.js";

export type valueType =
  | "role"
  | "textChannel"
  | "guildChannel"
  | "voiceChannel"
  | "string"
  | "guildMember"
  | "bannedUser"
  | "boolean"
  | "number"
  | "color"
  | "url"
  | "image"
  | "snowflake"
  | "timeLength";

export interface Argument {
  name: string;
  key: string;
  type: valueType;
  description?: string;
  optional?: boolean;
  defaultVal?: string;
  acceptedValues?: string[];
  cases?: { [key: string]: string };
}

export interface CommandInfo {
  name: string; // The name of the command
  category: string; // The category of this command, used to separate commands in the help command
  description: string; // The description of the command
  aliases: string[]; // The aliases of this command, these can be used instead of the name
  args: Argument[];
  guildOnly: boolean; // Whether this command should only be usable on a guild
  NSFW: boolean;
  userPermissions: PermissionString[];
  botPermissions: PermissionString[];
}

export interface BotInfo extends mongoose.Document {
  name: string;
  botId: string;
  commands: CommandInfo[];
}

const BotInfoSchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  botId: String,
  commands: [
    {
      name: String,
      category: String,
      description: String,
      aliases: [String],
      args: [Object],
      guildOnly: String,
      NSFW: String,
      userPermissions: [String],
      botPermissions: [String],
    },
  ],
});

export const BotInfo = mongoose.model<BotInfo>("BotInfo", BotInfoSchema);
