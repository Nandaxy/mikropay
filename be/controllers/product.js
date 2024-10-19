const HotspotProfile = require("../models/HotspotProfile.js");
const Router = require("../models/Router.js");

exports.getNameHotspotProfile = async (req, res) => {
    const { slug } = req.params;

    const routerData = await Router.findOne({ slug: slug });

    if (!routerData) {
        return res.json({ status: 400, message: "Slug Not Found" });
    }

    const profiles = await HotspotProfile.find({ router: routerData._id });

    if (!profiles || profiles.length === 0) {
        return res.json({ status: 400, message: "Profile Not Found" });
    }

    const filteredProfiles = profiles.map(profileData => ({
        name: profileData.name,
        profile: profileData.profile,
        price: profileData.price,
        sessionTimeout: profileData.sessionTimeout
    }));

    res.json({ status: 200, message: "Success", data: filteredProfiles });
};
