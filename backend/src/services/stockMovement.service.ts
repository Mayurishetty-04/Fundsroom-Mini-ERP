import { prisma } from "../lib/prisma";

export const createStockMovement = async (
  productId: string,
  quantity: number,
  movementType: "IN" | "OUT",
  reason: string,
  createdById: string
) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    let newStock = product.currentStock;

    if (movementType === "IN") {
      newStock = product.currentStock + quantity;
    }

    if (movementType === "OUT") {
      if (quantity > product.currentStock) {
        throw new Error(
          `Insufficient stock. Available stock: ${product.currentStock}`
        );
      }

      newStock = product.currentStock - quantity;
    }

    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: {
        currentStock: newStock,
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId,
        quantity,
        movementType,
        reason,
        createdById,
      },
    });

    return {
      movement,
      product: updatedProduct,
    };
  });
};

export const getStockMovements = async (
  productId?: string
) => {
  return prisma.stockMovement.findMany({
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
      createdBy: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};