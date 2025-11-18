const express = require("express");
const Tenant = require("../models/Tenant");

const router = express.Router();

// Add Tenant
router.post("/", async (req, res) => {
  try {
    const tenant = new Tenant(req.body);
    const saved = await tenant.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get All Tenants from the database mongoDB
router.get("/", async (req, res) => {
  const tenants = await Tenant.find();
  res.json(tenants);
});

// Update Tenant
router.put("/:id", async (req, res) => {
  try {
    const updated = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Tenant
router.delete("/:id", async (req, res) => {
  try {
    await Tenant.findByIdAndDelete(req.params.id);
    res.json({ message: "Tenant deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
