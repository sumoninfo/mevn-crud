const mongoose = require("mongoose");

const CategoryPost = mongoose.model(
    "CategoryPost",
    new mongoose.Schema({
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }
    })
);

module.exports = CategoryPost;
