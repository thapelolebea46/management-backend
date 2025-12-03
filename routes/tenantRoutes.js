const express = require("express");
const Tenant = require("../models/Tenant");

const router = express.Router();

/**
 * =====================================
 *  CREATE TENANT
 *  POST /api/tenants/
 * =====================================
 */
router.post("/", async (req, res) => {
  try {
    // Create new tenant using the request body
    const tenant = new Tenant(req.body);

    // Save to database
    const saved = await tenant.save();

    // Send saved tenant back to client
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * =====================================
 *  GET ALL TENANTS FOR A SPECIFIC USER
 *  GET /api/tenants/:user
 *
 *  Example:
 *  GET /api/tenants/johnDoe
 * =====================================
 */
router.get("/:user", async (req, res) => {
  try {
    const user = req.params.user;

    // Find all tenants that belong to this landlord/user
    const tenants = await Tenant.find({ user });

    res.json(tenants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =====================================
 *  ADD COMPLAINT TO A TENANT
 *  POST /api/tenants/add-complaint/:tenantId
 *
 *  Example body:
 *  { "complaint": "Noise at night" }
 * =====================================
 */
router.post("/add-complaint/:tenantId", async (req, res) => {
  const { complaint } = req.body;

  // Validate input
  if (!complaint)
    return res.status(400).json({ message: "Complaint text required" });

  try {
    // Find tenant by ID
    const tenant = await Tenant.findById(req.params.tenantId);

    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    // Push complaint into array
    tenant.complaints.push(complaint);

    // Save updated tenant
    await tenant.save();

    res.json({ message: "Complaint added", tenant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =====================================
 *  GET ALL COMPLAINTS FOR A TENANT
 *  GET /api/tenants/complaints/:tenantId
 * =====================================
 */
router.get("/complaints/:tenantId", async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.tenantId);

    if (!tenant) return res.status(404).json({ message: "Not found" });

    // Return only the complaints list
    res.json(tenant.complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =====================================
 *  UPDATE TENANT DETAILS
 *  PUT /api/tenants/:id
 * =====================================
 */
router.put("/:id", async (req, res) => {
  try {
    // Find by ID and update fields
    const updated = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return updated document
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * =====================================
 *  DELETE TENANT
 *  DELETE /api/tenants/:id
 * =====================================
 */
router.delete("/:id", async (req, res) => {
  try {
    await Tenant.findByIdAndDelete(req.params.id);

    res.json({ message: "Tenant deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
