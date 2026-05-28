const { PrismaClient } = require("@prisma/client");

const prismaGlobal = globalThis;
prismaGlobal.prisma ??= new PrismaClient();

module.exports = prismaGlobal.prisma;
