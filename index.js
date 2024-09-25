const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const bayarRoutes = require("./routes/bayar");
const callbackRoutes = require("./routes/callback");
const invoiceRoutes = require("./routes/invoice");
const adminRoutes = require("./routes/admin");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "free-palestine",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));

connectDB(); // Connect to MongoDB

// Main Routes
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use("/bayar", bayarRoutes);
app.use("/", callbackRoutes);
app.use("/", invoiceRoutes);
// end of Routes
// --------------------------------------//

// tes Admin Dashboard
app.use("/", adminRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
