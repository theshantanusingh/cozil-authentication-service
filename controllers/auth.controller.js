const jwt = require("jsonwebtoken");
const config = require("./../config/index.config");
const User = require("./../models/user.model");
const Token = require("./../models/token.model");
const logger = require("./../utils/logger.utils");

const {
    createAccessToken,
    createRefreshToken,
    saveRefreshToken
} = require("./../utils/token.utils");

logger.info("{module: auth.controller.js} , presently inside auth.controller.js file.");

async function loginController(req, res) {

    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            logger.warn(`{module: auth.controller.js} , user with username ${req.body.username} not found`);
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isValidUser = await user.isValidPassword(req.body.password);

        if (!isValidUser) {
            logger.warn(`{module: auth.controller.js} , user with username ${req.body.username} not found`);
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        logger.info(`{module: auth.controller.js} , user with username ${req.body.username} found, now creating access token and refresh token`);

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        const exp = new Date(Date.now() + config.jwt.refreshTokenExpiry);

        logger.info(`{module: auth.controller.js}, ${req.body.username} has setted up tokens, now saving the refreshtoken to db.`)

        await saveRefreshToken(user._id, refreshToken, exp);

        logger.info(`{module: auth.controller.js}, ${req.body.username} has saved the refreshtoken to db.`)

        return res.status(200).json({
            "message": "Login successfull",
            user,
            accessToken,
            refreshToken
        });

    } catch (err) {
        logger.error(` { module: auth.contoller.js and error is ${err} } there is a error in logging the user with username ${req.body.username}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

