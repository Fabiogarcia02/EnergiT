import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (nome: string, email: string, senha: string) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("Usuário já existe");

  const hashedSenha = await bcrypt.hash(senha, 10);
  return await User.create({ nome, email, senha: hashedSenha });
};

export const loginUser = async (email: string, senha: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Usuário não encontrado");

  const isMatch = await bcrypt.compare(senha, user.senha);
  if (!isMatch) throw new Error("Senha incorreta");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return { token, user: { id: user.id, nome: user.nome, email: user.email } };
};