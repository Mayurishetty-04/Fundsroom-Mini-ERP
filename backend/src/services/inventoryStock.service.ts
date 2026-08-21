import { prisma } from "../lib/prisma";

export const createInventoryStock = async (data: {
  productId: string;
  locationId: string;
  batchId: string;
  physicalQuantity: number;
  reservedQuantity?: number;
}) => {
  const reservedQuantity = data.reservedQuantity ?? 0;

  if (data.physicalQuantity < 0) {
    throw new Error("Physical quantity cannot be negative");
  }

  if (reservedQuantity < 0) {
    throw new Error("Reserved quantity cannot be negative");
  }

  if (reservedQuantity > data.physicalQuantity) {
    throw new Error(
      "Reserved quantity cannot exceed physical quantity"
    );
  }

  const product = await prisma.product.findUnique({
    where: {
      id: data.productId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const location = await prisma.location.findUnique({
    where: {
      id: data.locationId,
    },
  });

  if (!location) {
    throw new Error("Location not found");
  }

  const batch = await prisma.batch.findUnique({
    where: {
      id: data.batchId,
    },
  });

  if (!batch) {
    throw new Error("Batch not found");
  }

  if (batch.productId !== data.productId) {
    throw new Error(
      "Batch does not belong to the selected product"
    );
  }

  const inventory = await prisma.inventoryStock.create({
    data: {
      productId: data.productId,
      locationId: data.locationId,
      batchId: data.batchId,
      physicalQuantity: data.physicalQuantity,
      reservedQuantity,
    },
    include: {
      product: true,
      location: true,
      batch: true,
    },
  });

  return {
    ...inventory,
    availableQuantity:
      inventory.physicalQuantity -
      inventory.reservedQuantity,
  };
};

export const getInventoryStocks = async (filters?: {
  productId?: string;
  locationId?: string;
}) => {
  const stocks = await prisma.inventoryStock.findMany({
    where: {
      productId: filters?.productId,
      locationId: filters?.locationId,
    },
    include: {
      product: true,
      location: true,
      batch: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return stocks.map((stock) => ({
    ...stock,
    availableQuantity:
      stock.physicalQuantity -
      stock.reservedQuantity,
  }));
};