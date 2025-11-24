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




//get tenants with belonging to a user

router.get("/:user",async (req,res)=>{
  try{
    const user=req.params.user;
    const tenants=await Tenant.find({user});
    res.json(tenants);
  }catch(err){
    res.status(500).json({message:err.message});

  }
  
});
// ADD a complaint to tenant
router.post("/add-complaint/:tenantId", async (req, res) => {
  const { complaint } = req.body;

  if (!complaint)
    return res.status(400).json({ message: "Complaint text required" });

  try {
    const tenant = await Tenant.findById(req.params.tenantId);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    tenant.complaints.push(complaint);
    await tenant.save();

    res.json({ message: "Complaint added", tenant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET complaints for a tenant
router.get("/complaints/:tenantId", async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.tenantId);
    if (!tenant) return res.status(404).json({ message: "Not found" });

    res.json(tenant.complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
