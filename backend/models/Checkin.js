const mongoose = require("mongoose");

const CheckinSchema = new mongoose.Schema({
  treinoId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  dia: { type: String, required: true }, // "segunda", "terca", etc
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Checkin", CheckinSchema);
