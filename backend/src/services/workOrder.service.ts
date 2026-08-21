import { prisma } from "../lib/prisma";

const calculateShortage = async (
  productId: string,
  locationId: string,
  requiredQuantity: number
) => {
  const stocks = await prisma.inventoryStock.findMany({
    where: {
      productId,
      locationId,
    },
    select: {
      physicalQuantity: true,
      reservedQuantity: true,
    },
  });

  const availableQuantity = stocks.reduce(
    (total, stock) =>
      total +
      (stock.physicalQuantity - stock.reservedQuantity),
    0
  );

  const shortageQuantity = Math.max(
    requiredQuantity - availableQuantity,
    0
  );

  return {
    availableQuantity,
    shortageQuantity,
  };
};

export const createWorkOrder = async (data: {
  locationId: string;
  productId: string;
  requiredQuantity: number;
  assignedUserId: string;
}) => {
  if (data.requiredQuantity <= 0) {
    throw new Error(
      "Required quantity must be greater than zero"
    );
  }

  const [location, product, user] = await Promise.all([
    prisma.location.findUnique({
      where: {
        id: data.locationId,
      },
    }),

    prisma.product.findUnique({
      where: {
        id: data.productId,
      },
    }),

    prisma.user.findUnique({
      where: {
        id: data.assignedUserId,
      },
    }),
  ]);

  if (!location) {
    throw new Error("Location not found");
  }

  if (!product) {
    throw new Error("Product not found");
  }

  if (!user) {
    throw new Error("Assigned user not found");
  }

  const workOrder = await prisma.workOrder.create({
    data: {
      locationId: data.locationId,
      productId: data.productId,
      requiredQuantity: data.requiredQuantity,
      assignedUserId: data.assignedUserId,
    },
    include: {
      location: true,
      product: true,
      assignedUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  const stockCheck = await calculateShortage(
    data.productId,
    data.locationId,
    data.requiredQuantity
  );

  return {
    ...workOrder,
    availableQuantity: stockCheck.availableQuantity,
    shortageQuantity: stockCheck.shortageQuantity,
  };
};

export const getWorkOrders = async () => {
  const workOrders = await prisma.workOrder.findMany({
    include: {
      location: true,
      product: true,
      assignedUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Promise.all(
    workOrders.map(async (workOrder) => {
      const stockCheck = await calculateShortage(
        workOrder.productId,
        workOrder.locationId,
        workOrder.requiredQuantity
      );

      return {
        ...workOrder,
        availableQuantity: stockCheck.availableQuantity,
        shortageQuantity: stockCheck.shortageQuantity,
      };
    })
  );
};