// index.js
const express = require("express");
const router = express.Router();

// Import login module routes
const authRoutes = require("./auth");
const pageRoutes = require("./pages");

// Import employee management routes
const employeeRoutes = require("./employees");
const payrollRoutes = require("./payroll");

console.log("index.js: payrollRoutes:", payrollRoutes);

// Mount login module routes
router.use("/auth", authRoutes);
router.use("/", pageRoutes);

// Mount employee management routes with /employee prefix
router.use("/employee", employeeRoutes);
router.use("/payroll", payrollRoutes);

module.exports = router;