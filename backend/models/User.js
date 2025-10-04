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
  modalidade: { type: String, default: "" },
  plano: { type: String, default: "" },

  resetCodigo: { type: String },
  resetCodigoExp: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model("User", UsersSchema);