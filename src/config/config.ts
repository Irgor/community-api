import { databaseConfig } from "@config/database";
import { firbaseConfig } from "./firebase";

const SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 3000;

export const config = {
    mongo: databaseConfig,
    firbaseConfig,
    server: {
        port: SERVER_PORT
    }
}