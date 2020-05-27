const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req, res, next) => {
    const token = req.headers['auth-token'];
    if (!token) return res.status(401).send("Access Denied. No Token Provided.");

    try {
        const validToken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = validToken;
        next();
    } catch (error) {
        return res.status(400).send("Invalid Token");
    }
}