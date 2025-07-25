// middlewares/validateInput.middleware.js

const logger = require("../utils/logger.utils");

function validatePasswordInput(req, res, next) {
    const password = req.body.password;

    if(!password){
        logger.warn("{module: validateinput.middleware.js} [validatePasswordInput] NO PASSWORD FIELD WAS PROVIDED")
        return res.status(400).json({
            "messsage": "The password field is missing"
        })
    }

    const minLength = 5;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    const isValid = password.length >= minLength && hasLetter && hasNumber;

    if (!isValid) {
        return res.status(400).json({
            message: "Password must be at least 5 characters long and include a letter, number, and special character.",
            checks: {
                length: password.length >= minLength,
                hasLetter,
                hasNumber,
            }
        });
    }

    next(); // ✅ Validation passed, move to next controller
}

module.exports = {
    validatePasswordInput
};
