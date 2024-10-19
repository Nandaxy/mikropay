const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const bayarRoutes = require("./routes/bayar");
const callbackRoutes = require("./routes/callback");
const invoiceRoutes = require("./routes/invoice");
const productRoutes = require("./routes/product");

const { createPaymentGateway, createAdminUser } = require("./lib/startup");
const path = __dirname + "/views/";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    createAdminUser();
    createPaymentGateway();
  })
  .catch((err) => console.log(err));

app.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});
// sementara untuk fix error
app.get("/login", (req, res) => {
  res.redirect("/#/login");
});

app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);
app.use("/bayar", bayarRoutes);
app.use("/", callbackRoutes);
app.use("/", invoiceRoutes);
app.use("/", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
