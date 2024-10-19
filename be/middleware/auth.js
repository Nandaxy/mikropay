// middleware/auth.js
const jwt = require("jsonwebtoken");
const createResponse = (status, message, path, type, data = {}) => ({
    status,
    message,
    path,
    type,
    ...data,
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res
            .status(401)
            .json(createResponse(401, "No token provided", req.path, "unauthorized"));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res
                .status(403)
                .json(createResponse(403, "Invalid token", req.path, "forbidden"));
        }
        req.user = user; 
        next();
    });
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res
            .status(403)
            .json(createResponse(403, "Access denied: Admins only", req.path, "forbidden"));
    }
    next();
};

const authorizeUser = (req, res, next) => {
    if (req.user.role !== "user" && req.user.role !== "admin") {
        return res
            .status(403)
            .json(createResponse(403, "Access denied: Users only", req.path, "forbidden"));
    }
    next();
};

module.exports = {
    authenticateToken,
    authorizeAdmin,
    authorizeUser,
};
