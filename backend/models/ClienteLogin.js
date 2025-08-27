const mongoose = require("mongoose");

const ClienteLoginSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha_hash: { type: String, required: true },
  data_cadastro: { type: Date, default: Date.now },
  resetToken: { type: String },
  resetTokenExp: { type: Date }
});

module.exports = mongoose.model("ClienteLogin", ClienteLoginSchema);
