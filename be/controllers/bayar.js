const axios = require("axios");
const Transaction = require("../models/Transaction");
const PaymentGateway = require("../models/paymentGateway");
const Router = require("../models/Router");
const HotspotProfile = require("../models/HotspotProfile");
const mikrotikAction = require("../lib/mikrotikAction");

exports.createPayment = async (req, res) => {
    const { slug } = req.params;
    const { profile, merchantRef, method } = req.body;

    try {
        const routerData = await Router.findOne({ slug: slug });
        if (!routerData) {
            return res.status(404).json({ message: "Router not found." });
        }

        if (!routerData.isPaymentGatewayActive) {
            return res
                .status(404)
                .json({ message: "paymentGateway is Deactive." });
        }

        const checkMikrotik = await mikrotikAction(
            routerData,
            "get",
            "system/identity"
        );

        if (!checkMikrotik.status) {
            return res
                .status(404)
                .json({ message: "Mikrotik Offline or  not Authorization." });
        }

        // Find the associated payment gateway
        const paymentGateways = await PaymentGateway.findById(
            routerData.paymentGateway
        );

        if (!paymentGateways) {
            return res
                .status(404)
                .json({ message: "Payment Gateway not found." });
        }

        // Find the hotspot profile
        const hotspotProfiles = await HotspotProfile.findOne({
            profile: profile,
            router: routerData._id
        });
        if (!hotspotProfiles) {
            return res
                .status(404)
                .json({ message: "Hotspot profile not found." });
        }

        // console.log(hotspotProfiles);

        const tripay = {
            endpoint: paymentGateways.endpoint,
            apiKey: paymentGateways.apiKey,
            privateKey: paymentGateways.privateKey,
            merchantCode: paymentGateways.merchantCode
        };

        // console.log(tripay);

        // Check for existing unpaid transaction
        const existingTransaction = await Transaction.findOne({
            merchant_ref: merchantRef,
            status: "UNPAID"
        });

        if (existingTransaction) {
            return res.redirect(existingTransaction.checkout_url);
        }

        const amount = hotspotProfiles.price;
        console.log(amount);

        const data = {
            method,
            merchant_ref: merchantRef,
            amount,
            customer_name: "Ilham",
            customer_email: "mikropay@mikropay.com",
            customer_phone: "089912345678",
            order_items: [
                {
                    sku: merchantRef,
                    name: `${profile}-${merchantRef}`,
                    price: amount,
                    quantity: 1
                }
            ],
            expired_time: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
            signature: require("crypto")
                .createHmac("sha256", tripay.privateKey)
                .update(`${tripay.merchantCode}${merchantRef}${amount}`)
                .digest("hex")
        };

        // Create payment transaction
        const response = await axios.post(
            `${tripay.endpoint}transaction/create`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${tripay.apiKey}`
                }
            }
        );

        const {
            checkout_url,
            reference,
            status,
            expired_time,
            instructions,
            qr_string,
            qr_url
        } = response.data.data;

        const transaction = new Transaction({
            reference,
            merchant_ref: merchantRef,
            profile,
            payment_method: method,
            amount,
            checkout_url,
            status,
            customer_name: "Ilham",
            customer_email: "mikpy@py.py",
            customer_phone: "089997372812",
            router: routerData._id,
            hotspotProfiles: hotspotProfiles._id,
            vc_exp: hotspotProfiles.sessionTimeout,
            expired_time,
            instructions,
            qr_string,
            qr_url
        });

        await transaction.save();

        res.status(200).json({
            success: true,
            checkout_url,
            status,
            reference
        });
    } catch (error) {
        console.error("Error during payment creation:", error);
        res.status(500).json({
            message: "Error processing payment",
            error: error.message
        });
    }
};
