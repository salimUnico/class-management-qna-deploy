const mongoose = require("mongoose");

const questionPaperScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "Please provide name"],
            trim: true,
        },
        subject: {
            type: String,
            require: [true, "Please provide subject name"],
            trim: true,
        },
        date: {
            type: String,
            require: [true, "Please provide date"],
            trim: true,
        },
        marks: {
            type: String,
            require: [true, "Please provide marks"],
            trim: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("questionPaper", questionPaperScheme);
