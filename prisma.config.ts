import { defineConfig } from "prisma/config";

const mysqlHost = process.env.MYSQL_HOST;
const mysqlDatabase = process.env.MYSQL_DATABASE;
const mysqlUser = process.env.MYSQL_USER;
const mysqlPassword = process.env.MYSQL_PASSWORD;
const mysqlPort = Number(process.env.MYSQL_PORT || 3306);
const hasAnyMysqlSetting = [mysqlHost, mysqlDatabase, mysqlUser, mysqlPassword, process.env.MYSQL_PORT]
  .some(Boolean);
const hasAllMysqlCredentials = [mysqlHost, mysqlDatabase, mysqlUser, mysqlPassword]
  .every(Boolean);

if (hasAnyMysqlSetting && !hasAllMysqlCredentials) {
  throw new Error("Set MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER, and MYSQL_PASSWORD together.");
}
if (hasAllMysqlCredentials && (!Number.isInteger(mysqlPort) || mysqlPort < 1 || mysqlPort > 65535)) {
  throw new Error("MYSQL_PORT must be a valid TCP port.");
}

const sslSettings = process.env.NODE_ENV === "production" ? "?sslaccept=strict" : "";
const databaseUrl =
  mysqlHost && mysqlDatabase && mysqlUser && mysqlPassword
    ? `mysql://${encodeURIComponent(mysqlUser)}:${encodeURIComponent(mysqlPassword)}@${mysqlHost}:${mysqlPort}/${encodeURIComponent(mysqlDatabase)}${sslSettings}`
    : "";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
