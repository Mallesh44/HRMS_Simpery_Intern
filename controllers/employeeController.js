const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
});

exports.view = (req, res) => {
    db.query("SELECT * FROM employees", (err, rows) => {
        if (!err) {
            res.render("employee_manage", { employees: rows }); //changed rows to employees, and home to employee_manage
        } else {
            console.log("Error in listing data" + err);
        }
    });
};

exports.adduser = (req, res) => {
    res.render("adduser");
};

exports.save = (req, res) => {
    const { name, age, city, department, designation, salary, dateOfJoining, phone, email, address } = req.body;

    db.query(
        "INSERT INTO employees (NAME, AGE, CITY, DEPARTMENT, DESIGNATION, SALARY, DATE_OF_JOINING, PHONE, EMAIL, ADDRESS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [name, age, city, department, designation, salary, dateOfJoining, phone, email, address],
        (err, rows) => {
            if (!err) {
                res.render("adduser", { msg: "Employee Details Added Successfully" });
            } else {
                console.log("Error in listing data" + err);
            }
        }
    );
};

exports.edituser = (req, res) => {
    let id = req.params.id;

    db.query("SELECT * FROM employees WHERE id=?", [id], (err, rows) => {
        if (!err) {
            res.render("edituser", { rows });
        } else {
            console.log("Error in listing data" + err);
        }
    });
};

exports.edit = (req, res) => {
    const { name, age, city, department, designation, salary, dateOfJoining, phone, email, address } = req.body;
    let id = req.params.id;

    db.query(
        "UPDATE employees SET NAME=?, AGE=?, CITY=?, DEPARTMENT=?, DESIGNATION=?, SALARY=?, DATE_OF_JOINING=?, PHONE=?, EMAIL=?, ADDRESS=? WHERE ID=?",
        [name, age, city, department, designation, salary, dateOfJoining, phone, email, address, id],
        (err, rows) => {
            if (!err) {
                db.query("SELECT * FROM employees WHERE id=?", [id], (err, rows) => {
                    if (!err) {
                        res.render("edituser", { rows, msg: "Employee Details Updated Successfully" });
                    } else {
                        console.log("Error in listing data" + err);
                    }
                });
            } else {
                console.log("Error in listing data" + err);
            }
        }
    );
};

exports.delete = (req, res) => {
    let id = req.params.id;
    db.query("DELETE FROM employees WHERE id=?", [id], (err, rows) => {
        if (!err) {
            res.redirect("/employee"); //redirect to employee route.
        } else {
            console.log(err);
        }
    });
};