"use server";
import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth";
import { StripeManager } from "../../app/[locale]/admin/classes/stripeManager";
import { prisma } from "../lib/prisma";
const stripeManager = new StripeManager();

type stripeCustomerIdManagerProps = {
  id?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
};
export const stripeCustomerIdManager = async ({
  id,
  name,
  email,
}: stripeCustomerIdManagerProps) => {
  const userSession = await getServerSession(authOptions);
  if (!userSession && !id) {
    throw new Error("No user session or ID provided");
  }
  let getUser;
  if (id && name && email) {
    getUser = { email: email, id: id, name: name };
  } else if (userSession && userSession.user.email) {
    getUser = await prisma.user.findUnique({
      where: { email: userSession.user.email },
    });
  }

  if (!getUser) throw new Error("User not found");
  let customerId = getUser.customerId;
  const dataToSend = {
    email: getUser.email ?? "",
    metadata: {
      createdBy: "created by the user himself",
      id: getUser.id ?? undefined,
    },
    name: getUser.name ?? undefined,
  };
  const createCustomerId = await stripeManager.createCustomer({
    data: dataToSend,
    id: customerId ?? undefined,
  });
  if (createCustomerId) {
    await prisma.user.update({
      where: { id: getUser.id },
      data: { customerId: createCustomerId.data.id },
    });
    customerId = createCustomerId.data.id;
  }
  if (!customerId) {
    throw new Error("Customer ID not found");
  }
  return customerId;
};
