const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController"); // Corrected path
const userController = require("../controllers/users");

// View All Records
router.get("/", userController.isLoggedIn, userController.authorize(['admin']), employeeController.view);

// Add New Records
router.get("/adduser", userController.isLoggedIn, userController.authorize(['admin']), employeeController.adduser);
router.post("/adduser", userController.isLoggedIn, userController.authorize(['admin']), employeeController.save);

// Update Records
router.get("/edituser/:id", userController.isLoggedIn, userController.authorize(['admin']), employeeController.edituser);
router.post("/edituser/:id", userController.isLoggedIn, userController.authorize(['admin']), employeeController.edit);

// Delete Records
router.get("/deleteuser/:id", userController.isLoggedIn, userController.authorize(['admin']), employeeController.delete);

module.exports = router;