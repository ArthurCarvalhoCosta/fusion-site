require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Rotas
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const treinosRoutes = require('./routes/treinos');
const emailRoutes = require("./routes/email");
const checkinsRoutes = require("./routes/checkins");

const app = express();

/* ============================
   MIDDLEWARES
============================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_DEV,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / frontend interno
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS error: Origin not allowed"), false);
    },
    credentials: true,
  })
);

/* ============================
   ARQUIVOS ESTÁTICOS
============================ */
app.use("/assets", express.static(path.join(__dirname, "../frontend/src/assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ============================
   ROTAS
============================ */
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/treinos", treinosRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/checkins", checkinsRoutes);

app.get("/api/health", (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

/* ============================
   VARIÁVEIS
============================ */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

/* ============================
   MONGO
============================ */
if (!MONGO_URI) {
  console.error("❌ ERRO: MONGO_URI não está definido no .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => {
    console.error("❌ Erro ao conectar no MongoDB:", err);
    process.exit(1);
  });

/* ============================
   INICIAR SERVIDOR
============================ */
const server = app.listen(PORT, () =>
  console.log(`🚀 Backend rodando na porta ${PORT}`)
);

/* ============================
   ERROS GLOBAIS
============================ */
process.on("unhandledRejection", (reason) =>
  console.error("Unhandled Rejection:", reason)
);
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

module.exports = app;
