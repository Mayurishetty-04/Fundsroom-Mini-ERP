import { prisma } from "../lib/prisma";

export const createProduct = async (data: any) => {
  return prisma.product.create({
    data: {
      productName: data.productName,
      sku: data.sku,
      category: data.category,
      unitPrice: data.unitPrice,
      currentStock: data.currentStock ?? 0,
      minimumStockQuantity: data.minimumStockQuantity ?? 0,
      warehouseLocation: data.warehouseLocation,
    },
  });
};

export const getProducts = async (search?: string) => {
  return prisma.product.findMany({
    where: search
      ? {
          OR: [
            {
              productName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              sku: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

export const updateProduct = async (
  id: string,
  data: any
) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};