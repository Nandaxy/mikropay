const fs = require("fs");
const path = require("path");

const mikrotikAction = require("../lib/mikrotikAction.js");
const HotspotProfile = require("../models/HotspotProfile.js");
const Router = require("../models/Router.js");

exports.getNameHotspotProfile = async (req, res) => {
  const { slug } = req.params;

  const routerData = await Router.findOne({ slug: slug });

  if (!routerData) {
    return res.json({ status: 400, message: "Slug Not Found" });
  }

  if (!routerData.isPaymentGatewayActive) {
    return res.json({ status: 400, message: "Payment Gateway Not Active" });
  }

  const profiles = await HotspotProfile.find({ router: routerData._id });

  if (!profiles || profiles.length === 0) {
    return res.json({ status: 400, message: "Profile Not Found" });
  }



  const filteredProfiles = profiles.map((profileData) => ({
    name: profileData.name,
    profile: profileData.profile,
    price: profileData.price,
    sessionTimeout: profileData.sessionTimeout,
  }));

  res.json({ status: 200, message: "Success", data: filteredProfiles });
};

exports.orderVoucher = async (req, res) => {
  const { slug } = req.params;

  const routerData = await Router.findOne({ slug: slug });

  if (!routerData) {
    return res.send(renderErrorPage("Invalid Request"));
  }

  const checkMikrotik = await mikrotikAction(
    routerData,
    "get",
    "system/identity"
  );

  if (!checkMikrotik.status) {
    return res.send(renderErrorPage("Mikrotik Offline"));
  }

  const filePath = path.join(__dirname, "../page_templates", "beli-paket.html");

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: err });
    }

    const updatedHtml = data.replace(
      'const SLUG = "";',
      `const SLUG = "${slug}";`
    );
    res.send(updatedHtml);
  });
};

const renderErrorPage = (message) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f8d7da;
                color: #721c24;
                padding: 20px;
                text-align: center;
                dislay: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
            }
            h1 {
                font-size: 2em;
            }
            p {
                font-size: 1.2em;
            }
        </style>
    </head>
    <body>
    <div>
        <h1>Error</h1>
        <p>${message}</p>
        <p>Please check your url and try again.</p>
        </div>
    </body>
    </html>
    `;
};
