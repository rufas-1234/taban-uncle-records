import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

let prismaClient: PrismaClient | undefined;

export function hasMySqlConfiguration() {
  const credentials = [
    process.env.MYSQL_HOST,
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
  ];

  if (credentials.every((value) => !value)) {
    return false;
  }
  if (credentials.some((value) => !value)) {
    throw new Error("Set MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER, and MYSQL_PASSWORD together.");
  }

  const port = Number(process.env.MYSQL_PORT || 3306);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("MYSQL_PORT must be a valid TCP port.");
  }

  return true;
}

export function getPrismaClient() {
  const existingClient = globalForPrisma.prisma ?? prismaClient;
  if (existingClient) {
    return existingClient;
  }

  const host = process.env.MYSQL_HOST;
  const database = process.env.MYSQL_DATABASE;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const port = Number(process.env.MYSQL_PORT || 3306);

  if (!host || !database || !user || !password || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Set MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, and MYSQL_PASSWORD.");
  }

  const adapter = new PrismaMariaDb({
    host,
    port,
    database,
    user,
    password,
    connectionLimit: 5,
    timezone: "Z",
    ssl: process.env.NODE_ENV === "production"
      ? { minVersion: "TLSv1.2", rejectUnauthorized: true }
      : undefined,
  });
  const client = new PrismaClient({ adapter });
  prismaClient = client;

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}
