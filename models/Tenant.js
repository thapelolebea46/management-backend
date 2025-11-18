const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  nextOfKin: { type: String, require: true },
  contact: { type: String, required: true },
  roomNumber: { type: String, required: true },
  roomPrice:{type:Number, required:true}
});

module.exports = mongoose.model("Tenant", tenantSchema);
