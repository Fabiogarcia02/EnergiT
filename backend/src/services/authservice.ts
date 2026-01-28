import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const saltRounds = 10;

// Função de cadastro de usuário
export const registerUser = async (nome: string, email: string, senha: string) => {
  // Verifica se o email já está cadastrado
  const userExists = await prisma.users.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new Error("Email já está em uso");
  }

  // Criptografa a senha
  const hashedPassword = await bcrypt.hash(senha, saltRounds);

  // Cria o novo usuário no banco de dados
  const user = await prisma.users.create({
    data: {
      nome,
      email,
      senha_hash: hashedPassword,
    },
  });

  return user;
};
