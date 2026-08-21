import { prisma } from "../lib/prisma";

export const createBatch = async (data: {
  productId: string;
  batchNumber: string;
  expiryDate?: Date;
}) => {
  const product = await prisma.product.findUnique({
    where: {
      id: data.productId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return prisma.batch.create({
    data: {
      productId: data.productId,
      batchNumber: data.batchNumber.trim(),
      expiryDate: data.expiryDate,
    },
  });
};

export const getBatches = async (productId?: string) => {
  return prisma.batch.findMany({
    where: productId
      ? {
          productId,
        }
      : undefined,
    include: {
      product: {
        select: {
          id: true,
          productName: true,
          sku: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};