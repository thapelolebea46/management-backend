const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  nextOfKin: { type: String, required: true },
  contact: { type: Number, required: true },
  roomNumber: { type: Number, required: true },
  roomPrice: { type: Number, required: true },
  user: { type: String, required: true },
  complaints: { type: [String], default: [] }
});

module.exports = mongoose.model("Tenant", tenantSchema);
