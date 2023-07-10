const mongoose = require("mongoose");

const Author = mongoose.model(
    "Author",
    new mongoose.Schema({
        title: String,
        status: {
            type: String,
            enum: ['active', 'inactive']
        },
    })
);

module.exports = Author;
