const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha_hash: { type: String, required: true },

  resetCodigo: { type: String },
  resetCodigoExp: { type: Date },

  resetToken: { type: String },
  resetTokenExp: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Cliente", ClienteSchema);
