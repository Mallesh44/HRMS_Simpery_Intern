// payroll.js
const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

router.get('/payroll', payrollController.getAllPayroll);

module.exports = router;