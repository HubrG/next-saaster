import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { loginSchema } from "@/src/types/schemas/userSchema";

const loginCredentials = async (req: NextApiRequest, res: NextApiResponse) => {
  // Validation de la requête avec Zod
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error });
  }

  // Utiliser les données validées
  const { email, password } = validationResult.data;

  // Recherche de l'utilisateur par email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Vérification de l'utilisateur et du mot de passe
  if (!user || !(await bcrypt.compare(password, user.hashedPassword || ""))) {
    return res.status(401).json({ error: "Identifiants incorrects." });
  }

  // Réponse réussie avec les données de l'utilisateur
  res.status(200).json(user);
};

export default loginCredentials;
