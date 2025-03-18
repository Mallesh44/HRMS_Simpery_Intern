// users.js
const db = require("../config/db"); // Correct path
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

// ... rest of your code ...
exports.profile = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("/login");
        }

        const employeeId = req.user.ID; // Assuming users.ID and employees.ID are the same

        db.query("SELECT * FROM employees WHERE ID = ?", [employeeId], (err, employeeResults) => {
            if (err) {
                console.error("Error fetching employee data:", err);
                return res.render("profile", { user: req.user, employee: {} }); // Pass empty object on error
            }

            const employee = employeeResults[0] || {}; // Get the first result or an empty object

            const isEditing = req.query.edit === "true";

            res.render("profile", { user: req.user, employee: employee, isEditing: isEditing });
        });
    } catch (error) {
        console.error("Profile error:", error);
        res.redirect("/login");
    }
};

exports.updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("/login");
        }

        const employeeId = req.user.ID;
        const { age, city, department, designation, salary, dateOfJoining, phone, address} = req.body;

        db.query("SELECT * FROM employees WHERE ID = ?", [employeeId], (selectErr, selectResults)=>{
            if(selectErr){
                console.error("Error checking employee data:", selectErr);
                return res.render("profile", { user: req.user, employee: req.body, msg: "Error updating profile.", msg_type: "error" });
            }
            if(selectResults.length === 0){
                db.query("INSERT INTO employees (ID, AGE, CITY, DEPARTMENT, DESIGNATION, SALARY, DATE_OF_JOINING, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",[employeeId, age, city, department, designation, salary, dateOfJoining, phone, address], (insertError, insertResults)=>{
                    if(insertError){
                        console.error("Error inserting employee data:", insertError);
                        return res.render("profile", { user: req.user, employee: req.body, msg: "Error updating profile.", msg_type: "error" });
                    }
                    res.redirect("/profile");
                });
            } else {
                const sql = "UPDATE employees SET AGE = ?, CITY = ?, DEPARTMENT = ?, DESIGNATION = ?, SALARY = ?, DATE_OF_JOINING = ?, phone = ?, address = ? WHERE ID = ?";

                db.query(
                    sql,
                    [age, city, department, designation, salary, dateOfJoining, phone, address, employeeId],
                    (err, results) => {
                        if (err) {
                            console.error("Error updating profile:", err);
                            return res.render("profile", { user: req.user, employee: req.body, msg: "Error updating profile.", msg_type: "error" });
                        }
                        res.redirect("/profile");
                    }
                );
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.redirect("/profile");
    }
};

exports.login = async (req, res) => {
  try {
      const { email, password } = req.body;
      if (!email || !password) {
          return res.status(400).render("login", {
              msg: "Please Enter Your Email and Password",
              msg_type: "error",
          });
      }

      db.query("select * from users where email=?", [email], async (error, result) => {
          if (error) {
              console.error("Database Error:", error);
              return res.status(500).render("login", {
                  msg: "Database error occurred.",
                  msg_type: "error",
              });
          }

          if (result.length === 0) {
              return res.status(401).render("login", {
                  msg: "Invalid email or password.",
                  msg_type: "error",
              });
          }

          try {
              const match = await bcrypt.compare(password, result[0].PASS);
              if (!match) {
                  return res.status(401).render("login", {
                      msg: "Invalid email or password.",
                      msg_type: "error",
                  });
              } else {
                  const id = result[0].ID;
                  const role = result[0].role;
                  const token = jwt.sign({ id: id, role: role }, process.env.JWT_SECRET, {
                      expiresIn: process.env.JWT_EXPIRES_IN,
                  });
                  console.log("The Token is " + token);
                  const cookieOptions = {
                      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                      httpOnly: true,
                  };
                  res.cookie("mallesh", token, cookieOptions);
                  res.status(200).redirect("/home");
              }
          } catch (bcryptError) {
              console.error("Bcrypt Error:", bcryptError);
              return res.status(500).render("login", {
                  msg: "Password comparison failed.",
                  msg_type: "error",
              });
          }
      });
  } catch (error) {
      console.log(error);
  }
};

exports.register = (req, res) => {
    console.log(req.body);
    const { name, email, password, confirm_password, role } = req.body;

    db.query("select email from users where email=?", [email], async (error, result) => {
        if (error) {
            console.log(error);
            return res.render("register", {
                msg: "Database error occurred.",
                msg_type: "error",
            });
        }

        if (result.length > 0) {
            return res.render("register", {
                msg: "Email id already Taken",
                msg_type: "error",
            });
        } else if (password !== confirm_password) {
            return res.render("register", {
                msg: "Password do not match",
                msg_type: "error",
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query(
            "insert into users set ?",
            { name: name, email: email, pass: hashedPassword, role: role },
            (userError, userResult) => {
                if (userError) {
                    console.log(userError);
                    return res.render("register", {
                        msg: "Error registering user.",
                        msg_type: "error",
                    });
                } else {
                    const userId = userResult.insertId;

                    if (role === "employee") {
                        db.query(
                            "INSERT INTO employees (ID, NAME, AGE, CITY, DEPARTMENT, DESIGNATION, SALARY, DATE_OF_JOINING, LEAVE_DAYS_REMAINING, department_id, role_id, email, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            [userId, name, null, null, null, null, null, null, null, null, null, email, null, null], // Include name and email
                            (employeeError, employeeResult) => {
                                if (employeeError) {
                                    console.error("Error inserting employee details:", employeeError);
                                } else {
                                    console.log("Employee details added successfully:", employeeResult);
                                }
                            }
                        );
                    }

                    return res.render("register", {
                        msg: "User Registration Success",
                        msg_type: "good",
                    });
                }
            }
        );
    });
};

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.mallesh) {
        try {
            const decode = await promisify(jwt.verify)(req.cookies.mallesh, process.env.JWT_SECRET);
            db.query("select * from users where id=?", [decode.id], (err, results) => {
                if (!results) {
                    return next();
                }
                req.user = results[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
};

exports.logout = async (req, res) => {
    res.cookie("mallesh", "logout", {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
    });
    res.status(200).redirect("/");
};

//authorization
exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).send('Forbidden');
        }
        next();
    };
};