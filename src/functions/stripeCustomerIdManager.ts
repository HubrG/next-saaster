"use server";
import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth";
import { prisma } from "../lib/prisma";
import { StripeManager } from "../components/features/pages/admin/queries/classes/stripeManagerClass";
const stripeManager = new StripeManager();

export const stripeCustomerIdManager = async () => {
  const userSession = await getServerSession(authOptions);
  if (!userSession) {
    throw new Error("User not found");
  }
  const getUser = await prisma.user.findUnique({
    where: { id: userSession.user.id },
  });

  if (!getUser) throw new Error("User not found");
  let customerId = getUser.customerId;
  const dataToSend = {
    email: getUser.email ?? "",
    metadata: {
      createdBy: "created by the user himself",
      id: getUser.id,
    },
    name: getUser.name,
  };
  const createCustomerId = await stripeManager.createCustomer(
    dataToSend,
    customerId
  );
  if (createCustomerId) {
    await prisma.user.update({
      where: { id: getUser.id },
      data: { customerId: createCustomerId.id },
    });
    customerId = createCustomerId.id;
  }
  if (!customerId) {
    throw new Error("Customer ID not found");
  }
  return customerId;
};
