/// <reference types="node" />

export default {
  token: process.env.API_BOT_TOKEN,
  clientID: process.env.API_CLIENT_ID,
  clientSecret: process.env.API_CLIENT_SECRET,
  host: "api.autumnbot.net",
  website: "autumnbot.net",
  mongoString: process.env.API_MONGO_STRING,
};
