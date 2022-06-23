import dotenv  from "dotenv";
import { ConnectionOptions } from "typeorm";
import { User, Subscriber, Artist, Album, Category, Publisher, Language, Track, Key } from '../models'

dotenv.config();

const config: ConnectionOptions = {
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "none",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "none",
  entities: [User, Subscriber, Artist, Album, Category, Publisher, Language, Track, Key ],
  synchronize: true,
};

export default config;