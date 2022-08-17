const mongoose = require("mongoose");

const questionAnswerScheme = new mongoose.Schema(
    {
        qpid: {
            type: mongoose.Schema.Types.ObjectId,
            require: [true, "Please provide qpid"],
            trim: true,
            ref: 'questionPaper'
        },
        question: {
            type: String,
            require: [true, "Please provide question"],
            trim: true,
        },
        ans: {
            type: String,
            require: [false, "Please ans"],
            trim: true,
        },
        type: {
            type: String, // Text , MCQ
            require: [true, "Please provide question type"],
            trim: true,
        },
        mcq: [{
            type: String
        }],
        questionimage: {
            type: String,
            require: [false, "Please provide question image"],
            trim: true,
        },
        answerimage: {
            type: String,
            require: [false, "Please provide answer image"],
            trim: true,
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model("questionAnswer", questionAnswerScheme);
