// middlewares/validateInput.middleware.js

function validatePasswordInput(req, res, next) {
    const password = req.body.password;

    const minLength = 5;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isValid = password.length >= minLength && hasLetter && hasNumber && hasSpecial;

    if (!isValid) {
        return res.status(400).json({
            message: "Password must be at least 5 characters long and include a letter, number, and special character.",
            checks: {
                length: password.length >= minLength,
                hasLetter,
                hasNumber,
                hasSpecial
            }
        });
    }

    next(); // ✅ Validation passed, move to next controller
}

module.exports = {
    validatePasswordInput
};
