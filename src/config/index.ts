export const config: Config = require(`./${process.env.NODE_ENV}`).default;

/// <reference types="node" />

interface Config {
  token: string;
  clientID: string;
  clientSecret: string;
  host: string;
  website: string;
  mongoString: string;
}
