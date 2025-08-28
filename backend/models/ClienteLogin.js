// models/ClienteLogin.js
const mongoose = require("mongoose");

const ClienteLoginSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha_hash: { type: String, required: true }
});

module.exports = mongoose.model("ClienteLogin", ClienteLoginSchema);
