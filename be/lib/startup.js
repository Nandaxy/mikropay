const dotenv = require("dotenv");
const User = require("../models/User");
const PaymentGateway = require("../models/paymentGateway");

dotenv.config();

function generateRandomName(length = 3) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomName = "";
    for (let i = 0; i < length; i++) {
        randomName += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return randomName;
}

const createAdminUser = async () => {
    try {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminEmail = `mikrotik-${generateRandomName()}@mikropay.com`;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminRole = "admin";

        if (!adminUsername || !adminPassword) {
            console.error(
                "Error: ADMIN_USERNAME or ADMIN_PASSWORD is not set in the environment variables."
            );
            process.exit(1)
        }

        const existingAdmin = await User.findOne({ username: adminUsername });
        if (existingAdmin) {
            console.log("Admin user already exists");
            return;
        }

        const adminUser = new User({
            username: adminUsername,
            email: adminEmail,
            password: adminPassword,
            role: adminRole
        });

        await adminUser.save();
        console.log("Admin user created successfully");
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
};

const createPaymentGateway = async () => {
    try {
        const paymentGatewayCode = "tripay";

        const existingPaymentGateway = await PaymentGateway.findOne({
            code: paymentGatewayCode
        });
        if (existingPaymentGateway) {
            console.log("Payment gateway already exists");
            return;
        }

        const paymentGateway = new PaymentGateway({
            code: paymentGatewayCode
        });

        await paymentGateway.save();
        console.log("Payment gateway created successfully");
    } catch (error) {
        console.error("Error creating payment gateway:", error);
    }
};

module.exports = {
    createAdminUser,
    createPaymentGateway
};
