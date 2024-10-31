const express = require("express");
const User = require("../models/User");
const Router = require("../models/Router");
const PaymentGateway = require("../models/paymentGateway");
const HotspotProfile = require("../models/HotspotProfile");
const Transaction = require("../models/Transaction");
const IpPool = require("../models/IpPool");
const PppoeProfile = require("../models/PppoeProfile");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");
const router = express.Router();
const axios = require("axios");
const { z } = require("zod");
const mikrotikAction = require("../lib/mikrotikAction");

// -------------Validasi--------------------------------------
const isValidIP = (ip) => {
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};

const ipRangeSchema = z.object({
  name: z.string().nonempty("Name is required"),
  address: z.string().refine(
    (value) => {
      const rangeRegex =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\-(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (rangeRegex.test(value)) {
        const [startIP, endIP] = value.split("-");
        return isValidIP(startIP) && isValidIP(endIP);
      }
      return isValidIP(value);
    },
    {
      message: "Invalid IP range format or IP addresses",
    }
  ),
  routerId: z.string().nonempty("router is required"),
});

router.post(
  "/admin/users/add",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const {
      username,
      password,
      role,
      pppoeUsername,
      pppoePassword,
      telp,
      email,
    } = req.body;

    const path = "/admin/users/add";

    // Validate input
    if (
      !username ||
      !password ||
      !role ||
      (role !== "admin" && role !== "user")
    ) {
      return res.status(400).json({
        status: 400,
        message: "Invalid input parameters",
        path,
        type: "validation_error",
      });
    }

    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          status: 400,
          message: "Username already exists",
          path,
          type: "validation_error",
        });
      }

      const newUser = new User({
        username,
        password,
        role,
        pppoeUsername,
        pppoePassword,
        telp,
        email,
      });

      await newUser.save();

      res.status(201).json({
        status: 201,
        message: "User added successfully",
        path,
        type: "success",
        data: {
          userId: newUser._id,
          username: newUser.username,
          role: newUser.role,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.error("Error adding user:", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
        path,
        type: "error",
      });
    }
  }
);

router.get(
  "/admin/users/list",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const path = "/admin/users/list";

    try {
      const users = await User.find().select("-password"); // Exclude the password field
      res.json({
        status: 200,
        message: "Users retrieved successfully",
        path,
        type: "success",
        data: users,
      });
    } catch (error) {
      console.error("Error retrieving users:", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
        path,
        type: "error",
      });
    }
  }
);

router.post(
  "/admin/users/edit",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const {
      userId,
      username,
      password,
      role,
      pppoeUsername,
      pppoePassword,
      telp,
      email,
    } = req.body;
    const path = "/admin/users/edit";

    if (!userId) {
      return res.status(400).json({
        status: 400,
        message: "User ID is required",
        path,
        type: "validation_error",
      });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
          path,
          type: "not_found",
        });
      }

      // Update fields
      if (username) user.username = username;
      if (password) user.password = password; // Will be hashed in pre-save hook
      if (role) user.role = role;
      if (pppoeUsername) user.pppoeUsername = pppoeUsername;
      if (pppoePassword) user.pppoePassword = pppoePassword;
      if (telp) user.telp = telp;
      if (email) user.email = email;

      await user.save();

      res.json({
        status: 200,
        message: "User updated successfully",
        path,
        type: "success",
        data: {
          userId: user._id,
          username: user.username,
          role: user.role,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
        path,
        type: "error",
      });
    }
  }
);

router.post(
  "/admin/users/delete",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { userId } = req.body;
    const path = "/admin/users/delete";

    if (!userId) {
      return res.status(400).json({
        status: 400,
        message: "User ID is required",
        path,
        type: "validation_error",
      });
    }

    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
          path,
          type: "not_found",
        });
      }

      res.json({
        status: 200,
        message: "User deleted successfully",
        path,
        type: "success",
        data: {
          userId: user._id,
        },
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
        path,
        type: "error",
      });
    }
  }
);

router.get(
  "/admin/routes/list",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const routers = await Router.find().sort({ createdAt: -1 });
      res.json({
        status: 200,
        message: "Routers retrieved successfully",
        data: routers,
      });
    } catch (error) {
      console.error("Error retrieving routers:", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  }
);

router.get(
  "/admin/routes/find/:id",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      const router = await Router.findById(id);
      if (!router) {
        return res.status(404).json({
          status: 404,
          message: "Router not found",
        });
      }

      res.json({
        status: 200,
        message: "Router retrieved successfully",
        data: router,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  }
);

router.post(
  "/admin/routes/add",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { name, ip, port, username, password, dnsMikrotik } = req.body;
    if (!name || !ip || !port || !username) {
      return res.status(400).json({
        status: 400,
        message: "Name, IP, Port, and Username are required",
      });
    }

    try {
      // Check if a router with the same name already exists
      const existingRouter = await Router.findOne({ name });
      if (existingRouter) {
        return res.status(400).json({
          status: 400,
          message: "Router with this name already exists",
        });
      }

      // Create and save new router
      const newRouter = new Router({
        name,
        ip,
        port,
        username,
        password,
        dnsMikrotik,
      });
      await newRouter.save();
      res.json({
        status: 200,
        message: "Router added successfully",
        data: newRouter,
      });
    } catch (error) {
      console.error("Error adding router:", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  }
);

const generateSlug = () => {
  return Math.random().toString(36).substring(2, 8); // Menghasilkan slug acak 6 karakter
};

router.post(
  "/admin/routes/edit",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const {
      routerId,
      name,
      ip,
      port,
      username,
      password,
      dnsMikrotik,
      isPaymentGatewayActive,
      paymentGateway,
    } = req.body;

    if (!routerId) {
      return res.json({
        status: 400,
        message: "Router ID is required",
      });
    }

    try {
      const router = await Router.findById(routerId);
      if (!router) {
        return res.json({
          status: 404,
          message: "Router not found",
        });
      }

      // console.log("x", router);

      if (name) {
        const existingRouter = await Router.findOne({
          name,
          _id: { $ne: routerId },
        });
        if (existingRouter) {
          return res.json({
            status: 400,
            message: "Router with this name already exists",
          });
        }
      }

      // console.log("x", router);

      // Update fields
      if (name) router.name = name;
      if (ip) router.ip = ip;
      if (port) router.port = port;
      if (username) router.username = username;
      if (password) router.password = password;
      if (dnsMikrotik) router.dnsMikrotik = dnsMikrotik;

      // Handle payment gateway status
      if (isPaymentGatewayActive !== undefined) {
        // Check if paymentGateway is valid when activating
        if (isPaymentGatewayActive) {
          if (!paymentGateway) {
            return res.json({
              status: 400,
              message: "Payment Gateway ID is required when activating.",
            });
          }

          const validPaymentGateway = await PaymentGateway.findById(
            paymentGateway
          );
          if (!validPaymentGateway) {
            return res.json({
              status: 404,
              message: "Payment Gateway not found.",
            });
          }

          router.isPaymentGatewayActive = true; // Activate payment gateway
          router.paymentGateway = paymentGateway; // Set payment gateway

          // Generate slug only if it doesn't already exist
          if (!router.slug) {
            router.slug = generateSlug(); // Generate slug if not already created
          }
        } else {
          // If deactivating, just set isPaymentGatewayActive to false
          router.isPaymentGatewayActive = false;
          // Do not clear paymentGateway or slug
          // router.paymentGateway = null; // Clear payment gateway is not needed
        }
      }

      await router.save();
      res.json({
        status: 200,
        message: "Router updated successfully",
        data: router,
      });
    } catch (error) {
      console.error("Error updating router:", error);
      res.json({
        status: 500,
        message: "Server error",
      });
    }
  }
);

router.post(
  "/admin/routes/delete",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { routerId } = req.body;

    if (!routerId) {
      return res.status(400).json({
        status: 400,
        message: "Router ID is required",
      });
    }

    try {
      const router = await Router.findByIdAndDelete(routerId);
      if (!router) {
        return res.status(404).json({
          status: 404,
          message: "Router not found",
        });
      }

      res.json({
        status: 200,
        message: "Router deleted successfully",
        data: routerId,
      });
    } catch (error) {
      console.error("Error deleting router:", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  }
);

router.get(
  "/admin/payment-gateway",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const paymentGateway = await PaymentGateway.find();
      if (!paymentGateway) {
        return res.status(404).json({
          status: 404,
          message: "Payment gateway not found",
        });
      }

      res.json({
        status: 200,
        message: "Payment gateway retrieved successfully",
        data: paymentGateway,
      });
    } catch (error) {
      console.error("Error retrieving payment gateway:", error);
    }
  }
);

router.get(
  "/admin/payment-gateway/tripay",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const paymentGateway = await PaymentGateway.findOne({
        code: "tripay",
      });
      if (!paymentGateway) {
        return res.status(404).json({
          status: 404,
          message: "Payment gateway not found",
        });
      }

      res.json({
        status: 200,
        message: "Payment gateway retrieved successfully",
        data: paymentGateway,
      });
    } catch (error) {
      console.error("Error retrieving payment gateway:", error);
    }
  }
);

router.post(
  "/admin/payment-gateway/tripay/edit",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { apiKey, privateKey, merchantCode, endpoint } = req.body;

    if (!apiKey || !privateKey || !merchantCode || !endpoint) {
      return res.json({
        status: 400,
        message: "All fields are required",
      });
    }

    try {
      const paymentGateway = await PaymentGateway.findOne({
        code: "tripay",
      });
      if (!paymentGateway) {
        return res.json({
          status: 404,
          message: "Payment gateway not found",
        });
      }

      paymentGateway.apiKey = apiKey;
      paymentGateway.privateKey = privateKey;
      paymentGateway.merchantCode = merchantCode;
      paymentGateway.endpoint = endpoint;

      await paymentGateway.save();

      res.json({
        status: 200,
        message: "Payment gateway updated successfully",
        data: paymentGateway,
      });
    } catch (error) {
      console.error("Error updating payment gateway:", error);
    }
  }
);

router.post(
  "/mikrotik/action",

  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { routerData, method, endpoint, bodyData } = req.body;

    if (!routerData || !method) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const url = `http://${routerData.ip}:${routerData.port}/rest/${endpoint}`;

    try {
      const response = await axios({
        method,
        url,
        bodyData,
        auth: {
          username: routerData.username,
          password: routerData.password,
        },
        timeout: 30000,
      });

      // console.log(response.status);

      if (response.status === 200) {
        res.json({
          status: 200,
          message: "Data retrieved successfully",
          data: response.data,
        });
      } else if (response.status === 401) {
        res.json({
          status: 401,
          message: "Access Denied",
        });
      }
    } catch (error) {
      if (error.status === 401) {
        res.json({
          status: 401,
          message: "Access Denied",
        });
      } else {
        res.json({
          status: 500,
          message: "Failed to fetch data from MikroTik",
          error: error.message,
        });
      }
    }
  }
);

// Endpoint to list all hotspot profiles
router.get(
  "/admin/hotspot/profile/list",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const path = "/admin/hotspot/profile/list";
    try {
      const profiles = await HotspotProfile.find().populate("router"); // Populate router information if needed
      res.json({
        status: 200,
        message: "Hotspot profiles retrieved successfully",
        path,
        type: "success",
        data: profiles,
      });
    } catch (error) {
      console.error("Error retrieving hotspot profiles:", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
        path,
        type: "error",
      });
    }
  }
);

// Endpoint to get a specific hotspot profile
router.get(
    "/admin/hotspot/profile/find",
    authenticateToken,
    authorizeAdmin,
    async (req, res) => {
      const { id, routerId } = req.query;
      const path = "/admin/hotspot/profile/find";
  
      try {
        let profile;
  
        // Find a single document if `id` is provided
        if (id) {
          profile = await HotspotProfile.findOne({ _id: id }).populate("router");
        }
        // Find multiple documents if `routerId` is provided
        else if (routerId) {
          profile = await HotspotProfile.find({ router: routerId }).populate("router");
        }
  
        // Return 404 if no profile found
        if (!profile || (Array.isArray(profile) && profile.length === 0)) {
          return res.status(404).json({
            status: 404,
            message: "Hotspot profile not found",
            path,
            type: "not_found",
          });
        }
  
        res.json({
          status: 200,
          message: "Hotspot profile retrieved successfully",
          path,
          type: "success",
          data: profile,
        });
      } catch (error) {
        console.error("Error retrieving hotspot profile:", error);
        res.status(500).json({
          status: 500,
          message: "Server error",
          path,
          type: "error",
        });
      }
    }
  );
  

// Endpoint to add a new hotspot profile
router.post(
  "/admin/hotspot/profile/add",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const {
      name,
      profile,
      sessionTimeout,
      sharedUsers,
      rateLimit,
      price,
      routerId,
    } = req.body;
    const path = "/admin/hotspot/profile/add";

    if (!name || !routerId || !profile) {
      return res.status(400).json({
        status: 400,
        message: "Name, profile and Router ID are required",
        path,
        type: "validation_error",
      });
    }

    try {
      const detailRouter = await Router.findById(routerId);

      if (!detailRouter) {
        return res.status(404).json({
          status: 404,
          message: "Router not found",
          path,
          type: "validation_error",
        });
      }

      const existingProfile = await HotspotProfile.findOne({
        profile,
        routerId,
      });
      if (existingProfile) {
        return res.status(400).json({
          status: 400,
          message: "Hotspot profile with this profile already exists",
          path,
          type: "validation_error",
        });
      }

      const payload = {
        name: profile,
        "session-timeout": sessionTimeout,
        "rate-limit": rateLimit,
        "shared-users": sharedUsers,
      };

      console.log(payload);
      let code;

      const url = `http://${detailRouter.ip}:${detailRouter.port}/rest/ip/hotspot/user/profile`;

      try {
        const response = await axios.put(url, payload, {
          auth: {
            username: detailRouter.username,
            password: detailRouter.password,
          },
        });

        code = response.data[".id"];

        if (response.status !== 201) {
          return res.status(500).json({
            status: 500,
            message: "Failed to create hotspot profile on the router",
            path,
            type: "error",
          });
        }
      } catch (error) {
        return res.status(500).json({
          status: 500,
          message: "Error creating hotspot profile on router",
          path,
          type: "error",
        });
      }
      console.log(routerId);

      const newProfile = new HotspotProfile({
        name,
        profile,
        sessionTimeout,
        sharedUsers,
        rateLimit,
        price,
        code,
        router: routerId,
      });

      await newProfile.save();
      res.status(201).json({
        status: 201,
        message: "Hotspot profile added successfully",
        path,
        type: "success",
        data: newProfile,
      });
    } catch (error) {
      console.error("Error adding hotspot profile:", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
        path,
        type: "error",
      });
    }
  }
);

// Endpoint to edit an existing hotspot profile
router.post(
  "/admin/hotspot/profile/edit",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const {
      profileId,
      name,
      profile,
      sessionTimeout,
      sharedUsers,
      rateLimit,
      price,
    } = req.body;
    const path = "/admin/hotspot/profile/edit";

    // Validasi input: pastikan 'profileId' ada
    if (!profileId) {
      return res.status(400).json({
        status: 400,
        message: "Profile ID is required",
        path,
        type: "validation_error",
      });
    }

    try {
      // Mengambil profil hotspot berdasarkan ID
      const profileData = await HotspotProfile.findById(profileId).populate(
        "router"
      );
      if (!profileData) {
        return res.status(404).json({
          status: 404,
          message: "Hotspot profile not found",
          path,
          type: "not_found",
        });
      }

      // Mengambil detail router untuk melakukan panggilan API
      const detailRouter = profileData.router;
      if (!detailRouter) {
        return res.status(404).json({
          status: 404,
          message: "Router not found",
          path,
          type: "validation_error",
        });
      }

      const payload = {
        name: profile || profileData.profile,
        "session-timeout": sessionTimeout || profileData.sessionTimeout,
        "rate-limit": rateLimit || profileData.rateLimit,
        "shared-users": sharedUsers || profileData.sharedUsers,
      };

      const url = `http://${detailRouter.ip}:${detailRouter.port}/rest/ip/hotspot/user/profile/${profileData.code}`;

      try {
        const response = await axios.patch(url, payload, {
          auth: {
            username: detailRouter.username,
            password: detailRouter.password,
          },
        });

        // Optional: Check the response status or data if needed
        if (response.status !== 204 && response.status !== 200) {
          return res.status(500).json({
            status: 500,
            message: "Failed to update hotspot profile on the router",
            path,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error updating hotspot profile on router:", error);
        return res.status(500).json({
          status: 500,
          message: "Error updating hotspot profile on router",
          path,
          type: "error",
        });
      }

      // Update fields in the database
      if (name) profileData.name = name;
      if (profile) profileData.profile = profile;
      if (sessionTimeout) profileData.sessionTimeout = sessionTimeout;
      if (sharedUsers) profileData.sharedUsers = sharedUsers;
      if (rateLimit) profileData.rateLimit = rateLimit;
      if (price) profileData.price = price;

      // Simpan perubahan profil hotspot ke database
      await profileData.save();

      res.json({
        status: 200,
        message: "Hotspot profile updated successfully",
        path,
        type: "success",
        data: profile,
      });
    } catch (error) {
      console.error("Error updating hotspot profile:", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
        path,
        type: "error",
      });
    }
  }
);

// Endpoint to delete a hotspot profile
router.post(
  "/admin/hotspot/profile/delete",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { profileId } = req.body;
    const path = "/admin/hotspot/profile/delete";

    // Validasi input: pastikan 'profileId' ada
    if (!profileId) {
      return res.status(400).json({
        status: 400,
        message: "Profile ID is required",
        path,
        type: "validation_error",
      });
    }

    try {
      // Mengambil profil hotspot berdasarkan ID
      const profile = await HotspotProfile.findById(profileId).populate(
        "router"
      );
      if (!profile) {
        return res.status(404).json({
          status: 404,
          message: "Hotspot profile not found",
          path,
          type: "not_found",
        });
      }
      console.log(profile);

      // Mengambil detail router untuk melakukan panggilan API
      const detailRouter = profile.router;
      if (!detailRouter) {
        await HotspotProfile.findByIdAndDelete(profileId);
        return res.json({
          status: 200,
          message: "Router not found, but succes delete",
          path,
          type: "validation_error",
        });
      }

      // URL untuk menghapus profil di MikroTik
      const url = `http://${detailRouter.ip}:${detailRouter.port}/rest/ip/hotspot/user/profile/${profile.code}`;

      try {
        // Menghapus profil dari MikroTik router
        const response = await axios.delete(url, {
          auth: {
            username: detailRouter.username,
            password: detailRouter.password,
          },
        });

        // Optional: Check the response status or data if needed
        if (response.status !== 200) {
          await HotspotProfile.findByIdAndDelete(profileId);
          return res.json({
            status: 200,
            message:
              "Failed to delete hotspot profile on the router but succes deleted",
            path,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error deleting hotspot profile on router:", error);
        await HotspotProfile.findByIdAndDelete(profileId);
        return res.json({
          status: 200,
          message:
            "Failed to delete hotspot profile on the router but succes deleted",
          path,
          type: "error",
        });
      }

      // Menghapus profil hotspot dari database
      await HotspotProfile.findByIdAndDelete(profileId);

      res.json({
        status: 200,
        message: "Hotspot profile deleted successfully",
        path,
        type: "success",
        data: {
          profileId: profile._id,
        },
      });
    } catch (error) {
      console.error("Error deleting hotspot profile:", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
        path,
        type: "error",
      });
    }
  }
);

// transaksi
router.get(
  "/admin/transaction",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const all = req.query.all === "true";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const skip = (page - 1) * limit;

      let transactionData;
      let totalTransactions;

      if (all) {
        transactionData = await Transaction.find().sort({
          created_at: -1,
        });
        totalTransactions = transactionData.length;
      } else {
        totalTransactions = await Transaction.countDocuments();
        transactionData = await Transaction.find()
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit);
      }

      res.json({
        status: 200,
        message: "success",
        data: transactionData,
        pagination: all
          ? null
          : {
              total: totalTransactions,
              page,
              limit,
              totalPages: Math.ceil(totalTransactions / limit),
            },
      });
    } catch (error) {
      console.log(error);
      res.json({ status: 404, message: "error" });
    }
  }
);

// --------------------------- POOL ---------------------------

router.post(
  "/admin/pool/add",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const parsedData = ipRangeSchema.parse(req.body);

      const { name, address, routerId } = parsedData;

      console.log(routerId);

      if (!name || !address || !routerId) {
        return res.status(400).json({
          status: 400,
          message: "Name, profile and Router ID are required",
        });
      }

      const detailRouter = await Router.findById(routerId);

      if (!detailRouter) {
        return res.status(404).json({
          status: 404,
          message: "Router not found",
        });
      }

      const existingPool = await IpPool.findOne({ name });

      if (existingPool) {
        return res.json({
          status: 400,
          message: "Pool with this name already exists",
        });
      }

      const pool = new IpPool({
        name,
        address,
      });

      await pool.save();

      res.json({
        status: 200,
        message: "success",
        data: pool,
      });
    } catch (error) {
      // Tangani error validasi Zod
      if (error instanceof z.ZodError) {
        return res.json({
          status: 400,
          message: error.errors.map((err) => err.message).join(", "),
        });
      }
      console.log(error);
      res.json({ status: 500, message: "error" });
    }
  }
);

router.post(
  "/admin/pool/edit",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { poolId } = req.body;

      const parsedData = ipRangeSchema.parse(req.body);

      const { name, address } = parsedData;

      const existingPool = await IpPool.findById(poolId);

      if (!existingPool) {
        return res.json({
          status: 404,
          message: "Pool not found",
        });
      }

      existingPool.name = name;
      existingPool.address = address;

      await existingPool.save();

      res.json({
        status: 200,
        message: "Pool updated successfully",
        data: existingPool,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.json({
          status: 400,
          message: error.errors.map((err) => err.message).join(", "),
        });
      }
      res.json({
        status: 500,
        message: "Error updating pool",
        error: error.message,
      });
    }
  }
);

router.post(
  "/admin/pool/delete",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { poolId } = req.body;

      const existingPool = await IpPool.findById(poolId);

      if (!existingPool) {
        return res.json({
          status: 404,
          message: "Pool not found",
        });
      }

      await IpPool.findByIdAndDelete(poolId);

      res.json({
        status: 200,
        message: "Pool deleted successfully",
      });
    } catch (error) {
      res.json({
        status: 500,
        message: "Error deleting pool",
        error: error.message,
      });
    }
  }
);

router.get(
  "/admin/pool/list",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const pool = await IpPool.find();

      if (!pool) {
        return res.json({
          status: 404,
          message: "Pool not found",
        });
      }

      res.json({
        status: 200,
        message: "Pool found successfully",
        data: pool,
      });
    } catch (error) {
      res.json({
        status: 500,
        message: "Error fetching pool",
        error: error.message,
      });
    }
  }
);

router.get(
  "/admin/pool/find/:id",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const pool = await IpPool.findById(id);

      if (!pool) {
        return res.json({
          status: 404,
          message: "Pool not found",
        });
      }

      res.json({
        status: 200,
        message: "Pool found successfully",
        data: pool,
      });
    } catch (error) {
      res.json({
        status: 500,
        message: "Error fetching pool",
        error: error.message,
      });
    }
  }
);

// ------------------------------ PPPOE PROFILE ----------------]

// router.post(
//   "/admin/pppoe/profile/add",
//   authenticateToken,
//   authorizeAdmin,
//   async (req, res) => {
//     try {
//       const {
//         name,
//         profile,
//         rateLimit,
//         price,
//         remoteAddress,
//         localAddress,
//         onlyOne,
//         exp,
//         router,
//       } = req.body;

//       const data = {
//         "name": profile,
//         "rate-limit": rateLimit,
//         "remote-address": remoteAddress,
//         "local-address": localAddress,
//         "only-one": onlyOne,
//       };

//       const existingProfile = await PppoeProfile.findOne({ name });

//       if (existingProfile) {
//         return res.json({
//           status: 400,
//           message: "Profile with this name already exists",
//         });
//       }

//       const routerData = await Router.findById(router);

//       const mikrotik = await mikrotikAction(
//         routerData,
//         "put",
//         "ppp/profile",
//         data
//       );

//       console.log(mikrotik);

//       if (!mikrotik.status) {
//         return res.json({
//           status: 500,
//           message: "Error creating profile on Mikrotik",
//         });
//       }

//       const pppoeProfile = new PppoeProfile({
//         name,
//         profile,
//         rateLimit,
//         price,
//         remoteAddress,
//         localAddress,
//         onlyOne,
//         exp,
//         router,
//       });

//       await pppoeProfile.save();

//       res.json({
//         status: 200,
//         message: "success",
//         data: pppoeProfile,
//       });
//     } catch (error) {
//       console.log(error);
//       res.json({ status: 500, message: "error" });
//     }
//   }
// );

module.exports = router;
