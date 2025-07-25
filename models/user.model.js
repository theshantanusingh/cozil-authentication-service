const config = require("./../config/index.config");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const logger = require("./../utils/logger.utils");

logger.info(" { module: 'user.model.js' } presently inside user.model.js");
l

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: [30, "{ module: 'user.model.js' } Username must be under 30 characters"],
        minlength: [3, "{ module: 'user.model.js' } Username must be at least 3 characters"],
        match: [/^[a-zA-Z0-9_]+$/, "{ module: 'user.model.js' } Username can only contain letters, numbers, and underscores"]

    },

    password: {
        type: String,
        required: true,
        minlength: [5, "{ module: 'user.model.js' } Password must be at least 5 characters"],
    }
}, {
    timestamps: true,
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
})

userSchema.set("toObject", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

userSchema.statics.findByCredentials = async function (username, password) {
    const user = await this.findOne({ username });

    if (!user) {
        throw new Error("Invalid username or password");
    }

    const isValid = await user.isValidPassword(password);

    if (!isValid) {
        throw new Error("Invalid username or password");
    }
}

const User = mongoose.model("User", userSchema);

module.exports = User;