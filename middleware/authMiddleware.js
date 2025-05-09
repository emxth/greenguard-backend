const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key";

module.exports = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(403).json({ error: "Access denied" });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ error: "Unauthorized" });
            }
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    };
};
