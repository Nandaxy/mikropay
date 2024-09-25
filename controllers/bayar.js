const axios = require("axios");
const Transaction = require("../models/Transaction");
const Setting = require("../models/Setting");
const Router = require("../models/Router");

exports.createPayment = async (req, res) => {
  const userSetting = await Setting.findOne();
  // console.log(userSetting);

  const tripay = {
    endpoint: userSetting.endpoint,
    apiKey: userSetting.apiKey,
    privateKey: userSetting.privateKey,
    merchantCode: userSetting.merchantCode,
  };

  // console.log(tripay);
  if (userSetting && userSetting.router) {
    const routerId = userSetting.router;
    const router = await Router.findById(routerId);

    if (router) {
      // console.log("Router Data:", router);

      const { profile } = req.body;
      const selectedProfile = router.hotspotProfiles.find(
        (p) => p.profileName === profile
      );

      if (!selectedProfile) {
        return res.status(400).send("Profile not found");
      }

      const amount = selectedProfile.amount;
      const { merchantRef, method, mac } = req.body;

      if (!tripay.privateKey) {
        console.error("Private key is not defined.");
        return res
          .status(500)
          .send("Internal Server Error");
      }

      try {
        const existingTransaction = await Transaction.findOne({
          merchant_ref: merchantRef,
          status: "UNPAID",
        });
        if (existingTransaction) {
          return res.redirect(existingTransaction.checkout_url);
        }

        const data = {
          method,
          merchant_ref: merchantRef,
          amount,
          customer_name: "Ilham",
          customer_email: "mikpy@py.py",
          customer_phone: "089997372812",
          order_items: [
            {
              sku: merchantRef,
              name: `${profile}-${merchantRef}`,
              price: amount,
              quantity: 1,
            },
          ],
        //   return_url: "http://dede.net",
          expired_time: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          signature: require("crypto")
            .createHmac("sha256", tripay.privateKey)
            .update(`${tripay.merchantCode}${merchantRef}${amount}`)
            .digest("hex"),
        };

        // console.log("data", data);

        const response = await axios.post(
          `${tripay.endpoint}transaction/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${tripay.apiKey}`,
            },
          }
        );

        // console.log("Payment creation response:", response.data);

        const {
          checkout_url,
          reference,
          status,
          expired_time,
          instructions,
          qr_string,
          qr_url,
        } = response.data.data;

        const transaction = new Transaction({
          reference,
          merchant_ref: merchantRef,
          profile,
          payment_method: method,
          amount,
          checkout_url,
          status,
          mac,
          customer_name: "Ilham",
          customer_email: "mikpy@py.py",
          customer_phone: "089997372812",
          expired_time,
          instructions,
          qr_string,
          qr_url,
        });

        await transaction.save();

        res.status(200).json({
          success: true,
          checkout_url,
          status,
          reference,
        });
      } catch (error) {
        console.error("Error during payment creation:", error);
        res.status(500).send("Error processing payment");
      }
    } else {
      console.log("Router not found");
      return res.status(404).send("Router not found");
    }
  } else {
    console.log("User setting or router ID is not defined");
    return res.status(400).send("User setting or router ID is not defined");
  }
};
