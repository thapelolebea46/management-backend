const mongoose = require("mongoose");

// Tenant Schema: Stores information about each tenant in the system
const tenantSchema = new mongoose.Schema({
  // Tenant's first name
  firstName: { type: String, required: true },

  // Tenant's last name
  lastName: { type: String, required: true },

  // Name of next of kin (emergency contact)
  nextOfKin: { type: String, required: true },

  // Contact number of the tenant
  contact: { type: Number, required: true },

  // The room number the tenant is occupying
  roomNumber: { type: Number, required: true },

  // The monthly price of the room
  roomPrice: { type: Number, required: true },

  // The owner/user who added this tenant (useful for filtering tenants per landlord)
  user: { type: String, required: true },

  // List of complaints associated with this tenant
  complaints: { type: [String], default: [] },

 
});

module.exports = mongoose.model("Tenant", tenantSchema);
