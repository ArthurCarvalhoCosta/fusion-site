const mongoose = require("mongoose");

const TreinoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    inicio: { type: Date, required: true },
    fim: { type: Date, required: true },
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
    segunda: { type: String, default: "" },
    terca: { type: String, default: "" },
    quarta: { type: String, default: "" },
    quinta: { type: String, default: "" },
    sexta: { type: String, default: "" },
    sabado: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Treino", TreinoSchema);
