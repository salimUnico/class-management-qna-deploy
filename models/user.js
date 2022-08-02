const mongoose = require("mongoose");

const userScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "Please provide first name"],
            trim: true,
        },
        email: {
            type: String,
            match: [
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide a valid email address",
            ],
            unique: true,
            required: [true, "Please provide a email address"],
        },
        role: {
            type: String, // admin | manager | executive | customer
            require: [true, "Please provide Role"],
            trim: true,
        },
        password: {
            type: String,
            unique: true,
            require: [true, "Please provide Password"],
            trim: true,
        },
        telephone: {
            type: Number,
            require: [true, "Please provide Telephone Number"],
            trim: true,
        },
        resetToken: {
            token: {
                type: String,
                default: null,
            },
            expiry: {
                type: Date,
                default: null,
            },
        },
        emailverified: {
            type: Boolean,
            default: false,
        },
        adminverfied: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model("user", userScheme);
