import mongoose from "mongoose";
import { config } from "../config";
import { GuildSettings } from "./schemas/GuildSettings";

// Connect to MongoDB
mongoose.connect(config.mongoString, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Log Database Errors
db.on("error", (err) => console.error(err));

// Log a message once the Database connection is made
db.once("open", () => console.log(`Connected to MongoDB Atlas at ${db.name}!`));

// Export our database with the different Schemas
export const database = {
  guildSettings: GuildSettings,
};

// Helper function to get a guild's settings
export const getGuildSettings = async (guildId: string) => {
  const settings = await GuildSettings.findOne({ guild: guildId });
  return settings;
};

export const updateGuildSettings = async (
  guildId: string,
  settings: GuildSettings
) => {
  await GuildSettings.updateOne({ guild: guildId }, settings);
};

export type profileProperty =
  | "color"
  | "pronouns"
  | "gender"
  | "age"
  | "biography";
