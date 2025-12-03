import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nextOfKin: { type: String, required: true },
  contact: { type: Number, required: true },
  roomNumber: { type: Number, required: true },
  roomPrice: { type: Number, required: true },
  user: { type: String, required: true },
  complaints: { type: [String], default: [] },
  imageUrl: { type: String, required: true },


});

export default mongoose.model("Tenant", tenantSchema);
