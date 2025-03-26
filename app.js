const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

dotenv.config({
    path: "./.env",
});

hbs.registerHelper('hasLength', function(value) {
    return value && value.length > 0;
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files FIRST!
const location = path.join(__dirname, "./public");
app.use(express.static(location));

app.set("view engine", "hbs");

const partialsPath = path.join(__dirname, "./views/partials");
hbs.registerPartials(partialsPath);

// Routes
app.use("/", require("./routes/index"));
app.use("/payroll", require("./routes/payroll")); // Register payroll routes

app.listen(4000, () => {
    console.log("Server Started @ Port 4000");
});