import { prisma } from "../lib/prisma";

const generateChallanNumber = async () => {
  const count = await prisma.challan.count();

  return `CH-${String(count + 1).padStart(6, "0")}`;
};

export const createChallan = async (
  customerId: string,
  items: {
    productId: string;
    quantity: number;
  }[],
  createdById: string
) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const productIds = items.map(
    (item) => item.productId
  );

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (products.length !== productIds.length) {
    throw new Error("One or more products not found");
  }

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const challanNumber =
    await generateChallanNumber();

  const challan = await prisma.challan.create({
    data: {
      challanNumber,
      customerId,
      totalQuantity,
      createdById,

      items: {
        create: items.map((item) => {
          const product = products.find(
            (p) => p.id === item.productId
          );

          if (!product) {
            throw new Error("Product not found");
          }

          return {
            productId: product.id,
            quantity: item.quantity,

            // Product snapshot
            productName: product.productName,
            sku: product.sku,
            unitPrice: product.unitPrice,
          };
        }),
      },
    },

    include: {
      customer: true,
      items: true,
    },
  });

  return challan;
};

export const confirmChallan = async (
  challanId: string
) => {
  return prisma.$transaction(async (tx) => {
    const challan = await tx.challan.findUnique({
      where: {
        id: challanId,
      },
      include: {
        items: true,
      },
    });

    if (!challan) {
      throw new Error("Challan not found");
    }

    if (challan.status !== "DRAFT") {
      throw new Error(
        "Only draft challans can be confirmed"
      );
    }

    // First check stock for ALL products
    for (const item of challan.items) {
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product) {
        throw new Error(
          `Product ${item.productName} not found`
        );
      }

      if (
        product.currentStock < item.quantity
      ) {
        throw new Error(
          `Insufficient stock for ${product.productName}. Available: ${product.currentStock}, Required: ${item.quantity}`
        );
      }
    }

    // Reduce stock and create stock movements
    for (const item of challan.items) {
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      await tx.product.update({
        where: {
          id: product.id,
        },
        data: {
          currentStock:
            product.currentStock -
            item.quantity,
        },
      });

      await tx.stockMovement.create({
        data: {
          productId: product.id,
          quantity: item.quantity,
          movementType: "OUT",
          reason: `Sales Challan ${challan.challanNumber}`,
          createdById: challan.createdById,
        },
      });
    }

    // Finally confirm the challan
    const confirmedChallan =
      await tx.challan.update({
        where: {
          id: challanId,
        },

        data: {
          status: "CONFIRMED",
        },

        include: {
          customer: true,
          items: true,
        },
      });

    return confirmedChallan;
  });
};

export const getChallans = async () => {
  return prisma.challan.findMany({
    include: {
      customer: {
        select: {
          id: true,
          customerName: true,
          businessName: true,
        },
      },

      createdBy: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },

      items: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getChallanById = async (
  id: string
) => {
  return prisma.challan.findUnique({
    where: {
      id,
    },

    include: {
      customer: true,

      createdBy: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },

      items: true,
    },
  });
};