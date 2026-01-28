import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secrettoken";

export const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if (!token) {
    return res.status(403).json({ message: "Acesso negado" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = user;
    next();
  });
};
