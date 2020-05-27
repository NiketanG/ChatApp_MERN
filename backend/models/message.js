const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    to: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
    },
    time: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 30,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    type: {
        type: String
    }
});

const Message = mongoose.model('Message', MessageSchema);

exports.Message = Message;
