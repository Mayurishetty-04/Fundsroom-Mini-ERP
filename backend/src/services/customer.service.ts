import { prisma } from "../lib/prisma";

export const createCustomer = async (
  data: any,
  userId: string
) => {
  return prisma.customer.create({
    data: {
      ...data,
      followUpDate: data.followUpDate
        ? new Date(data.followUpDate)
        : undefined,
      createdById: userId,
    },
  });
};

export const getCustomers = async (
  search?: string,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          {
            customerName: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            businessName: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            mobile: {
              contains: search,
            },
          },
        ],
      }
    : {};

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.customer.count({ where }),
  ]);

  return {
    customers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCustomerById = async (id: string) => {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      followUps: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

export const updateCustomer = async (
  id: string,
  data: any
) => {
  return prisma.customer.update({
    where: { id },
    data: {
      ...data,
      followUpDate: data.followUpDate
        ? new Date(data.followUpDate)
        : undefined,
    },
  });
};