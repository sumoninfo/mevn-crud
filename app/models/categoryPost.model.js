const {Schema, model} = require('mongoose');
const categoryPostSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

const CategoryPost = model('CategoryPost', categoryPostSchema);

module.exports = CategoryPost
