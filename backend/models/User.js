// models/User.js
const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  nome: { type: String, required: true },

  genero: {
    type: String,
    enum: ["masculino", "feminino", "Prefiro não dizer"],
    default: "Prefiro não dizer",
  },

  email: { type: String, required: true, unique: true },

  senha_hash: { type: String, required: true },

  tipo: {
    type: String,
    enum: ["Admin", "Aluno", "Personal Trainer"],
    default: "Aluno",
  },

  cpf: { type: String, default: "" },

  modalidade: {
    type: String,
    enum: [
      "",
      "Jiu-Jitsu Adulto",
      "Jiu-Jitsu Kids",
      "Funcional",
      "Boxe",
      "Combo 1 - 2. Mod",
      "Combo 2 - 3. Mod",
      "Funcional Fight",
      "Funcional Step",
      "Funcional Pro",
      "Funcional Kids",
    ],
    default: "",
  },
  
  plano: {
    type: String,
    enum: [
      "",
      "Mensal - 2x",
      "Mensal - 3x",
      "Mensal - 6x",
      "Trimestral - 3x",
      "Trimestral - 6x",
      "Semestral - 3x",
      "Semestral - 6x",
    ],
    default: "",
  },

  avatarUrl: { type: String, default: "" },

  resetCodigo: { type: String },
  resetCodigoExp: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model("User", UsersSchema);
