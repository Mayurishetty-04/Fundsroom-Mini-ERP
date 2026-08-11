import { prisma } from "../lib/prisma";

export const createFollowUp = async (
  customerId: string,
  note: string,
  followUpDate: string | undefined,
  createdById: string
) => {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const followUp = await prisma.customerFollowUp.create({
    data: {
      customerId,
      note,
      followUpDate: followUpDate
        ? new Date(followUpDate)
        : undefined,
      createdById,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  // Keep customer's next follow-up date updated
  if (followUpDate) {
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        followUpDate: new Date(followUpDate),
      },
    });
  }

  return followUp;
};