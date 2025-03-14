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
            res.render("employee_manage", { employees: rows });
        } else {
            console.log("Error in listing data" + err);
        }
    });
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
    const { name, age, city, department, designation, salary, dateOfJoining, phone, email, address, department_id, role_id } = req.body;
    let id = req.params.id;

    db.query(
        "UPDATE employees SET NAME=?, AGE=?, CITY=?, DEPARTMENT=?, DESIGNATION=?, SALARY=?, DATE_OF_JOINING=?, PHONE=?, EMAIL=?, ADDRESS=?, department_id = ?, role_id = ? WHERE ID=?",
        [name, age, city, department, designation, salary, dateOfJoining, phone, email, address, department_id, role_id, id],
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
            res.redirect("/employee");
        } else {
            console.log(err);
        }
    });
};