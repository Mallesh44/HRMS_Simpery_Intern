// payrollController.js
const db = require("../config/db"); // Correct path
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

// ... rest of your code ...
exports.calculateNetPay = (grossPay, taxes) => {
    return grossPay - taxes;
};

exports.getAllPayroll = (req, res) => {
    db.query('SELECT u.NAME, p.* FROM payroll p JOIN users u ON p.EMPLOYEE_ID = u.id', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving payroll data');
        }

        const payrollData = results.map(payroll => {
            if (!payroll.NET_PAY) {
                payroll.NET_PAY = exports.calculateNetPay(payroll.GROSS_PAY, payroll.TAXES);
            }
            return payroll;
        });

        res.render('payroll', { payrolls: payrollData, user: req.user });
    });
};