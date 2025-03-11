const express = require("express");
const router = express.Router();

// Import login module routes
const authRoutes = require("./auth");
const pageRoutes = require("./pages");

// Import employee management routes
const employeeRoutes = require("./employees");

// Mount login module routes
router.use("/auth", authRoutes);
router.use("/", pageRoutes);

// Mount employee management routes with /employee prefix
router.use("/employee", employeeRoutes);

module.exports = router;