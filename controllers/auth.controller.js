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

async function signupController(req, res) {
    logger.info("{module: auth.controller.js} [signupController]");

    const { username, password } = req.body;

    try {
        if (!username || !password) {
            logger.warn(`{module: auth.controller.js}, [signupController] did not provied with all credentials, missing anyone of them.`)
            res.status(400).json({
                message: `Either of username or password is missing, do provide us with all credentials to access signup.`
            });
        }
        const isalreadypresent = await User.findOne({ username });

        if (isalreadypresent) {
            logger.warn(`{module: auth.controller.js}, [signupController] user with username ${username} already exists`);
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ username, password });
        logger.info(`{module: auth.controller.js}, [signupController] user ${user.username} created successfully`);

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        const exp = new Date(Date.now() + config.jwt.refreshTokenExpiry);
        await saveRefreshToken(user._id, refreshToken, exp);

        logger.info(`{module: auth.controller.js}, [signupController] user ${user.username} refresh token created successfuly`);

        return res.status(201).json({
            message: "User created successfully",
            accessToken,
            refreshToken
        });

    } catch (err) {
        logger.err("{module: auth.controller.js}, [signupController] Error signing up user: ${err.message}")
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};

async function loginController(req, res) {
    logger.info("{module: auth.controller.js} [loginController]");

    const { username, password } = req.body;

    try {
        if (!username || !password) {
            logger.warn(`{module: auth.controller.js}, [loginController] did not provied with all credentials, missing anyone of them.`)
            res.status(400).json({
                message: `Either of username or password is missing, do provide us with all credentials to access login.`
            });
        }

        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            logger.warn(`{module: auth.controller.js}, [loginController] user with username ${req.body.username} not found`);
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isValidUser = await user.isValidPassword(req.body.password);

        if (!isValidUser) {
            logger.warn(`{module: auth.controller.js}, [loginController] user with username ${req.body.username} not found`);
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        logger.info(`{module: auth.controller.js}, [loginController] user with username ${req.body.username} found, now creating access token and refresh token`);

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        const exp = new Date(Date.now() + config.jwt.refreshTokenExpiry);

        logger.info(`{module: auth.controller.js}, ${req.body.username}, [loginController] has setted up tokens, now saving the refreshtoken to db.`);

        await saveRefreshToken(user._id, refreshToken, exp);

        logger.info(`{module: auth.controller.js}, ${req.body.username}, [loginController] has saved the refreshtoken to db.`);

        return res.status(200).json({
            "message": "Login successfull",
            user,
            accessToken,
            refreshToken
        });

    } catch (err) {
        logger.error(` { module: auth.contoller.js and error is ${err} } [loginController] there is a error in logging the user with username ${req.body.username}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

async function logoutController(req, res) {
    logger.info("{module: auth.controller.js} [logoutContoller] ");

    const { refreshToken } = req.body;

    try {

        const deleted = await Token.findOneAndDelete({ token: refreshToken });

        if (!deleted) {
            logger.warn(`{module: auth.controller.js}, [logoutContoller] Refresh Token not found, maybe already logout.`)
            res.status(200).json({
                message: "Logged out (token may have already expired)"
            })
        }

        logger.info(`{module: auth.controller.js}, [logoutContoller] User loggedout seccessfully, token removed from DB`);
        res.status(200).json({
            message: "User logged out successfully"
        });

    } catch (err) {
        logger.error(`{module: auth.controller.js}, [logoutContoller] Error during logout. Internal server error,  err: ${err}`)
        res.status(500).json({
            message: "Error logging out. Internal server error"
        })
    }
};

module.exports = {
    signupController,
    loginController,
    logoutController
};