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
        bannerInstructionFirst: {
            type: String,
            require: [true, "Please provide banner Instruction First"],
            trim: true,
        },
        bannerInstructionSecond: {
            type: String,
            require: [true, "Please provide banner Instruction Second"],
            trim: true,
        },
        bannerLabel: {
            type: String,
            require: [true, "Please provide banner Label"],
            trim: true,
        },
        tbc: {
            type: String,
            require: [true, "Please provide T.B.C"],
            trim: true,
        },
        testbookletseries: {
            type: String,
            require: [true, "Please provide Test Booklet Series"],
            trim: true,
        },
        serialno: {
            type: String,
            require: [true, "Please provide Serial No"],
            trim: true,
        },
        timeallowed: {
            type: String,
            require: [true, "Please provide Time allowed"],
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
