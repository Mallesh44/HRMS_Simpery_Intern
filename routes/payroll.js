// filepath: c:\Users\malle\Desktop\login_system - Copy\routes\payroll.js
const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payrollController");
const userController = require("../controllers/users");

// Define payroll routes
router.get("/", userController.isLoggedIn, userController.authorize(['admin']), payrollController.getAllPayroll);

module.exports = router;