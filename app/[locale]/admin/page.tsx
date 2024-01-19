import { authOptions } from "@/src/lib/next-auth/auth";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function Admin({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const firstConnexion = searchParams.first;
  // On prend les parametres de l'url
  // const { locale } = useRouter();
  const session = await getServerSession(authOptions);
  console.log(session)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div>
      Admin
    </div>
  );
}
