const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ajusta o caminho se necessário

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ success: false, message: "Token não fornecido" });

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "secretkey";
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).lean();
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    req.user = user;
    next();
  } catch (err) {
    console.error("authMiddleware erro:", err);
    res.status(401).json({ success: false, message: "Token inválido ou expirado" });
  }
};
