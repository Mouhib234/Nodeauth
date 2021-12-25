// Main server entry point
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();

//DB
const dbConfig = require("./config/database");

// Database connect
mongoose.connect(dbConfig.database);

// Case connection with database is done
mongoose.connection.on("connected", () => {
  console.log("Done");
});
// Case connection with database is failled
mongoose.connection.on("error", (err) => {
  console.log(err);
});

// Bring user routes
const userRoutes = require("./routes/users");

// Port number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, "client")));

//Body Parser Middleware
app.use(bodyParser.json());

require("./config/passport")(passport);

//Express Session Middleware
app.set("trust proxy", 1);
app.use(
  session({
    secret: "time",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Users Routes
app.use("/users", userRoutes);

// index Route
app.get("/", (req, res) => res.send("Invalid Endpoint"));

// Start Server
app.listen(port, () => console.log(`Server started on port ${port}`));
