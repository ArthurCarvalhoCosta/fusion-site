const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB conectado"))
.catch(err => console.log("Erro ao conectar MongoDB:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
