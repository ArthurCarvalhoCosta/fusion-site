const mongoose = require("mongoose");

const CadastroClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha_hash: { type: String, required: true }
});

module.exports = mongoose.model("CadastroCliente", CadastroClienteSchema);
