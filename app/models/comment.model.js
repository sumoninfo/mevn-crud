const mongoose = require("mongoose");
const Category = mongoose.model(
    "Comment",
    new mongoose.Schema({
        body: {type: String, required: true},
        commentable: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'commentableModel'
        },
        commentableModel: {
            type: String,
            required: true,
            enum: ['Post'] // Replace 'OtherModel' with the actual model name if applicable
        }
    })
);

module.exports = Category;
