import { prisma } from "../lib/prisma";

export const createLocation = async (data: {
  name: string;
  code: string;
}) => {
  return prisma.location.create({
    data: {
      name: data.name,
      code: data.code.toUpperCase(),
    },
  });
};

export const getLocations = async () => {
  return prisma.location.findMany({
    orderBy: {
      name: "asc",
    },
  });
};