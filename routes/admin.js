const express = require("express");
const router = express.Router();
const axios = require("axios");

const { userApp } = require("../config");
const Setting = require("../models/Setting");
const Router = require("../models/Router");
const Transaction = require("../models/Transaction");

// middeleware

function authMiddleware(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect("/login");
    }
}
// basic routes

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === userApp.username && password === userApp.password) {
        req.session.loggedIn = true;
        res.redirect("/dashboard");
    } else {
        res.render("login", { error: "Invalid credentials" });
    }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const setting = await Setting.findOne();
        const routers = await Router.find();
        res.render("dashboard", {
            username: userApp.username,
            setting,
            routers
        });
    } catch (error) {
        console.error(error);
        res.render("dashboard", {
            username: userApp.username,
            setting: null,
            routers: []
        });
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

// app seting
router.post("/setting", authMiddleware, async (req, res) => {
    const { endpoint, apiKey, privateKey, merchantCode, router } = req.body;

    try {
        let setting = await Setting.findOne();

        if (setting) {
            setting.endpoint = endpoint;
            setting.apiKey = apiKey;
            setting.privateKey = privateKey;
            setting.merchantCode = merchantCode;
            setting.router = router;
            await setting.save();
            console.log(
                `Updated settings: Endpoint: ${endpoint}, Router: ${router}`
            );
        } else {
            const newSetting = new Setting({
                endpoint,
                apiKey,
                privateKey,
                merchantCode,
                router
            });
            await newSetting.save();
            console.log(
                `Saved new settings: Endpoint: ${endpoint}, Router: ${router}`
            );
        }

        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.redirect("/dashboard");
    }
});

// router seting
router.get("/r/detail/:id", authMiddleware, async (req, res) => {
    try {
        const router = await Router.findById(req.params.id);
        if (router) {
            const auth = {
                username: router.username,
                password: router.password
            };

            try {
                const response = await axios.get(
                    `http://${router.ip}:${router.port}/rest/ip/dhcp-client`,
                    { auth, timeout: 10000 }
                );
                const connected = response.status === 200;
                const dhcpClients = response.data.map(client => ({
                    address: client.address,
                    gateway: client.gateway,
                    interface: client.interface,
                    status: client.status
                }));

                res.render("routerDetail", { router, connected, dhcpClients });
            } catch (fetchError) {
                res.render("routerDetail", {
                    router,
                    connected: false,
                    dhcpClients: []
                });
            }
        } else {
            res.status(404).send("Router not found");
        }
    } catch (error) {
        res.status(500).send("Server error");
    }
});
router.post("/add-router", authMiddleware, async (req, res) => {
    const { name, ip, port, username, password, dnsMikrotik } = req.body;

    try {
        const existingRouter = await Router.findOne({ name });
        if (existingRouter) {
            console.error("Router name must be unique.");
            return res.redirect("/dashboard");
        }

        const newRouter = new Router({
            name,
            ip,
            port,
            username,
            password,
            dnsMikrotik
        });

        await newRouter.save();
        console.log(
            `Router Details Saved: IP: ${ip}, Port: ${port}, Username: ${username}`
        );
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error saving router:", error);
        res.redirect("/dashboard");
    }
});

router.get("/r/edit/:id", authMiddleware, async (req, res) => {
    try {
        const router = await Router.findById(req.params.id);
        if (router) {
            res.render("editRouter", { router });
        } else {
            res.status(404).send("Router not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.post("/r/update/:id", authMiddleware, async (req, res) => {
    const { name, ip, port, username, password, dnsMikrotik } = req.body;

    try {
        await Router.findByIdAndUpdate(req.params.id, {
            name,
            ip,
            port,
            username,
            password,
            dnsMikrotik
        });
        console.log(`Router updated: ${name}`);
        res.redirect(`/r/detail/${req.params.id}`);
    } catch (error) {
        console.error("Error updating router:", error);
        res.redirect(`/r/detail/${req.params.id}`);
    }
});

router.post("/r/delete/:id", authMiddleware, async (req, res) => {
    try {
        await Router.findByIdAndDelete(req.params.id);
        console.log(`Router with ID: ${req.params.id} deleted`);
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error deleting router:", error);
        res.status(500).send("Server error");
    }
});

// price off hotspot

router.post("/r/:id/hotspot-profiles", authMiddleware, async (req, res) => {
    const { profileName, amount } = req.body;

    try {
        const router = await Router.findById(req.params.id);
        if (!router) {
            return res.status(404).send("Router not found");
        }

        router.hotspotProfiles.push({ profileName, amount });
        await router.save();
        res.redirect(`/r/detail/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.post(
    "/r/detail/:id/hotspot-profiles/edit/:profileId",
    authMiddleware,
    async (req, res) => {
        const { profileName, amount } = req.body;

        try {
            const router = await Router.findById(req.params.id);
            const profile = router.hotspotProfiles.id(req.params.profileId);

            if (!profile) {
                return res.status(404).send("Profile not found");
            }

            profile.profileName = profileName;
            profile.amount = amount;
            await router.save();

            res.redirect(`/r/detail/${req.params.id}`);
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error");
        }
    }
);

router.post(
    "/r/detail/:id/hotspot-profiles/delete/:profileId",
    authMiddleware,
    async (req, res) => {
        try {
            const router = await Router.findById(req.params.id);

            // Filter out the profile to be deleted
            router.hotspotProfiles = router.hotspotProfiles.filter(
                profile => profile._id.toString() !== req.params.profileId
            );

            // Save the updated router
            await router.save();

            res.redirect(`/r/detail/${req.params.id}`);
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error");
        }
    }
);

// dapatkan data transaksi

router.get("/api/get-transaction", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find(); 
        res.status(200).json({
            status: true,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: [] });
    }
});


// cek status
router.get("/api/router-status", async (req, res) => {
    const { ip, port } = req.query;
    try {
        const response = await fetch(`http://${ip}:${port}/rest/`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch router status" });
    }
});

module.exports = router;
