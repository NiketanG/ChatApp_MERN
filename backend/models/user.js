const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255,
    },
    online: {
        type: Boolean,
        default: false
    }
});

UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    return token;
}

const User = mongoose.model('User', UserSchema);

function validateUser(user) {
    const Schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        username: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
        repeat_password: Joi.ref("password"),
    });
    return Schema.validate(user);
}

function validateUserLogin(user) {
    const Schema = Joi.object({
        email: Joi.string().min(5).max(255).email(),
        username: Joi.string().alphanum().min(3).max(30),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
    }).or('email', 'username');
    return Schema.validate(user);
}

function validateUserUpdate(user) {
    const Schema = Joi.object().keys({
        name: Joi.string().min(3).max(50),
        email: Joi.string().min(5).max(255).email(),
        username: Joi.string().alphanum().min(3).max(30),
        oldPassword: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
        newPassword: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/)
    }).and('oldPassword', 'newPassword');
    return Schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
exports.validateLogin = validateUserLogin;
exports.validateUpdate = validateUserUpdate;
