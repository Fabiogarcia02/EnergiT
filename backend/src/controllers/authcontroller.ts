import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authservice.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body;
    const user = await registerUser(nome, email, senha);

    res.status(201).json({
      message: "Usuário cadastrado com sucesso",
      user,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    const data = await loginUser(email, senha);
    
    res.status(200).json({ 
      message: "Login realizado com sucesso", 
      token: data.token,
      user: data.user 
    });
  } catch (error) {
    const err = error as Error;
    res.status(401).json({ message: err.message });
  }
};