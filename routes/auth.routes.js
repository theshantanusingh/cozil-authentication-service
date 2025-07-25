const router = require('express').Router();
const logger = require("../utils/logger.utils");
const {
    signupController,
    loginController,
    logoutController
} = require('../controllers/auth.controller');

const {
    validatePasswordInput
} = require('../middlewares/validateinput.middleware');


logger.info(`{module: auth.routes.js}, inside file auth.routes.js presently`);

router.route('/auth/signup').post(validatePasswordInput, signupController);
router.route('/auth/login').post(loginController);
router.route('/auth/logout').post(logoutController);

module.exports = router;