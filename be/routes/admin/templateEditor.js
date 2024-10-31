const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const { authenticateToken, authorizeAdmin } = require("../../middleware/auth");

const defaultTemplatePath = path.join(
  __dirname,
  "../../page_templates/default/voucher-default.html"
);

router.get(
  "/voucher/template",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const templatePath = path.join(
        __dirname,
        "../../page_templates/voucher.html"
      );
      const template = await fs.readFile(templatePath, "utf8");
      res.json({ status: 200, data: template });
    } catch (error) {
      console.error("Error reading voucher template:", error);
      res.json({ status: 500, message: "Failed to read voucher template" });
    }
  }
);

router.post(
  "/voucher/template",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { content } = req.body;
    const templatePath = path.join(
      __dirname,
      "../../page_templates/voucher.html"
    );

    try {
      await fs.writeFile(templatePath, content, "utf8");
      res.json({ status: 200, message: "Template updated successfully" });
    } catch (error) {
      console.error("Error saving voucher template:", error);
      res.json({ status: 500, message: "Failed to save voucher template" });
    }
  }
);

router.post(
  "/voucher/template/reset",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const templatePath = path.join(
      __dirname,
      "../../page_templates/voucher.html"
    );

    try {
      const defaultTemplate = await fs.readFile(defaultTemplatePath, "utf8");
      await fs.writeFile(templatePath, defaultTemplate, "utf8");
      res.json({
        status: 200,
        message: "Template reset to default successfully",
      });
    } catch (error) {
      console.error("Error resetting voucher template:", error);
      res.json({ status: 500, message: "Failed to reset voucher template" });
    }
  }
);

module.exports = router;
