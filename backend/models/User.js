const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha_hash: { type: String, required: true },
  tipo: {
    type: String,
    enum: ["Admin", "Aluno", "Personal Trainer"],
    default: "Aluno",
  },
  cpf: { type: String, default: "" },
  modalidade: { type: String, default: "" },
  plano: { type: String, default: "" },

  resetCodigo: { type: String },
  resetCodigoExp: { type: Date },

  status: { type: String, default: "Ativo" },
}, { timestamps: true });

module.exports = mongoose.model("User", UsersSchema);
