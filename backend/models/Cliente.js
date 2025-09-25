const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha_hash: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExp: { type: Date }
});

module.exports = mongoose.model("Cliente", ClienteSchema);
