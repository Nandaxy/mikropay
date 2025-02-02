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
const TemplateEditorRoutes = require("./routes/admin/templateEditor");

const userHotspotRoutes = require("./routes/admin/userHotspot");
const voucher = require("./routes/voucher");

const { createPaymentGateway, createAdminUser } = require("./lib/startup");
const path = __dirname + "/views/";
const publicPath = __dirname + "/public/";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path));
app.use(express.static(publicPath));

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

app.use("/status", require("./routes/status"));

app.use("/api", require("./routes/admin/userApp"));

app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", userHotspotRoutes);
app.use("/api", voucher);
app.use("/api", TemplateEditorRoutes);
app.use("/bayar", bayarRoutes);
app.use("/", callbackRoutes);
app.use("/", invoiceRoutes);
app.use("/", productRoutes);

app.get("/error", (req, res) => {
  res.send("Ada Kesalahan. Silahkan coba lagi nanti");
});

app.get("/download/template-hotspot", (req, res) => {
  res.download(publicPath + "hotspot.zip");
});
// sementara untuk fix error
app.get("/login", (req, res) => {
  setTimeout(() => {
    res.redirect("/#/login");
  }, 1000);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
