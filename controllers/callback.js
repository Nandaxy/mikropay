const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Setting = require("../models/Setting");
const Router = require("../models/Router");
const { default: axios } = require("axios");
const crypto = require("crypto");

router.post("/callback", async (req, res) => {
    const json = req.body;
    // console.log(json);

    const userSetting = await Setting.findOne();
    if (!userSetting) {
        return res
            .status(500)
            .json({ success: false, message: "Settings not found" });
    }

    const tripay = {
        endpoint: userSetting.endpoint,
        apiKey: userSetting.apiKey,
        privateKey: userSetting.privateKey,
        merchantCode: userSetting.merchantCode
    };

    const signature = crypto
        .createHmac("sha256", tripay.privateKey)
        .update(JSON.stringify(json))
        .digest("hex");
    const callbackSignature = req.headers["x-callback-signature"];

    if (callbackSignature !== signature) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid signature" });
    }

    const { merchant_ref, status } = json;

    try {
        const transaction = await Transaction.findOne({ merchant_ref });

        if (!transaction || transaction.status !== "UNPAID") {
            return res.status(404).json({
                success: false,
                message: "Transaction not found or already paid"
            });
        }

        if (json.is_closed_payment === 1 && status === "PAID") {
            const routerId = userSetting.router;
            const router = await Router.findById(routerId);
            if (!router) {
                return res
                    .status(404)
                    .json({ success: false, message: "Router not found" });
            }

            const url = `http://${router.ip}:${router.port}/rest/ip/hotspot/user`;
            // console.log(url);
            const auth = {
                username: router.username,
                password: router.password
            };

            // console.log(auth);

            const userParams = {
                server: "all",
                profile: transaction.profile,
                name: transaction.merchant_ref,
                password: transaction.merchant_ref,
                comment: "vc-tripay"
            };
            // console.log(userParams);

            try {
                const response = await axios.put(url, userParams, {
                    auth: auth,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                console.log("User added response:", response.data);

                transaction.status = "PAID";
                await transaction.save();
                res.json({ success: true });
            } catch (error) {
                console.error(
                    "Failed to add user to MikroTik:",
                    error.response ? error.response.data : error.message
                );
                res.status(500).json({
                    success: false,
                    message: "Failed to add user to MikroTik"
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid payment status"
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
