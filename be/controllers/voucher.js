const Router = require("../models/Router");
const fs = require("fs").promises;
const path = require("path");

// Function to read the voucher template file
async function readVoucherTemplate() {
  const templatePath = path.join(__dirname, "../page_templates/voucher.html");
  try {
    return await fs.readFile(templatePath, "utf8");
  } catch (error) {
    console.error("Error reading voucher template:", error);
    throw new Error("Failed to read voucher template");
  }
}

// Function to generate voucher HTML for a single user
function generateVoucherHtml(user, template) {
  const usernameEncoded = encodeURIComponent(user.name);
  const passwordEncoded = encodeURIComponent(user.password);
  const voucherCode = `username=${usernameEncoded}&password=${passwordEncoded}`;

  return template
    .replace(/{{username}}/g, user.name)
    .replace(/{{password}}/g, user.password)
    .replace("{{profile}}", user.profile)
    .replace("{{limit-uptime}}", user["limit-uptime"])
    .replace(/{{voucherCode}}/g, voucherCode); 
}

// Controller function for generating vouchers
async function generateVouchers(req, res) {
  try {
    const { users, routerId } = req.body;

    if (!users || !Array.isArray(users) || users.length === 0 || !routerId) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const router = await Router.findById(routerId);
    if (!router) {
      return res.status(404).json({ message: "Router not found" });
    }

    const template = await readVoucherTemplate();
    const voucherHtmls = users.map((user) =>
      generateVoucherHtml(user, template)
    );

    const combinedHtml = `
          ${voucherHtmls.join("\n")}
    `;

    res.status(200).json({
      message: "Vouchers generated successfully",
      template: combinedHtml,
    });
  } catch (error) {
    console.error("Error generating vouchers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { generateVouchers };
