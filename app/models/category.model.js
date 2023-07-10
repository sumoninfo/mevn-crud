const mongoose = require("mongoose");

const Category = mongoose.model(
    "Category",
    new mongoose.Schema({
        title: String,
        status: {
            type: String,
            enum: ['active', 'inactive']
        },
    })
);

module.exports = Category;
