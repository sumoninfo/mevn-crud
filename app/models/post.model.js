const mongoose = require("mongoose");

const Post = mongoose.model(
    "Post",
    new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        content: String,
        status: {
            type: String,
            enum: ['active', 'inactive']
        },
        date: {
            type: Date,
            default: Date.now()
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Author'
        }
    })
);

module.exports = Post;
