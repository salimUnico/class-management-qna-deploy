const mongoose = require("mongoose");

const noteScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "Please provide question"],
            trim: true,
        },
        json: [{
          type:{
            type: String, //title,subtitle,parah,img
            },
            value:{
                type: String,
            }
        }]
    },
    { timestamps: true }
);
module.exports = mongoose.model("note", noteScheme);
