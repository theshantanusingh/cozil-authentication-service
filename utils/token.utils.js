"use strict";
const jwt = require("jsonwebtoken");
const Token = require("./../models/token.model");
const logger = require("./logger.utils");
const config = require("./../config/index.config");

logger.info(`{module: token.utils.js} presently inside token.model.js file.`)

function createAccessToken(user) {
    logger.info(` {module: token.utils.js}, [createAccessToken]`)

    try {
        logger.info(` {module: 'token.util.js'} [createAccessToken] ${JSON.stringify(user)} is trying to create access token. Creating access token for user ${user.username}`);

        const accessToken = jwt.sign(user, config.jwt.accessTokenSecret, { expiresIn: config.jwt.accessTokenExpiry });

        logger.info(` {module: 'token.util.js'}, [createAccessToken] Created access token for user ${user.username} and token is ${accessToken}`);
        return accessToken;
    } catch (err) {
        logger.error(` {module: 'token.util.js', [createAccessToken] , error: ${err}} Failed to create access token`);

        throw new Error("Failed to create access token", err);
    }
}

function createRefreshToken(user) {
    logger.info(` {module: token.utils.js}, [createRefreshToken]`)

    try {

        logger.info(` {module: 'token.util.js'}, [createRefreshToken] ${JSON.stringify(user)}  is truing to create a refresh token. Creating refresh token for user ${user.username}`);

        const refreshToken = jwt.sign(user, config.jwt.refreshTokenSecret, { expiresIn: config.jwt.refreshTokenExpiry });

        logger.info(` {module: 'token.util.js'}, [createRefreshToken] Created refresh token for user ${user.username} and token is ${refreshToken}`);
        return refreshToken;
    } catch (err) {
        logger.error(` {module: 'token.utils.js'}, [createRefreshToken] error: ${err} Failed to created refresh token.`)

        throw new Error("Failed to create refresh token.");
    }
}

async function saveRefreshToken(userid, token, exp) {
    logger.info(` {module: token.utils.js}, [saveRefreshToken]`)

    const newtoken = {
        user: userid,
        token: token,
        expiresAt: exp
    };
    logger.info(` {module: 'token.utils.js'}, [saveRefreshToken] Saving refresh token for user ${userid}`);
    try {
        const savedtoken = await Token.create(newtoken);
        logger.info(` {module: 'token.utils.js'}, [saveRefreshToken] Successfully saved refresh token for user ${userid}`);
        return savedtoken;
    } catch (err) {
        logger.error(` {module: 'token.utils.js'}, [saveRefreshToken] error: ${err} Failed to save refresh token for user ${userid}`);

        throw new Error("Failed to save refresh token.");
    }
}


module.exports = {
    createAccessToken,
    createRefreshToken,
    saveRefreshToken
}