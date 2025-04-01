// filepath: c:\Users\malle\Desktop\login_system - Copy\routes\legalFramework.js
const express = require("express");
const router = express.Router();
const legalFrameworkController = require("../controllers/legalFrameworkController");

// Define route for legal framework
router.get("/", legalFrameworkController.getLegalFramework);

module.exports = router;