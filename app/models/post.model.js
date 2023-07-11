const {Schema, model} = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");

const postSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'Author'
    },
}, {
    toJSON: {virtuals: true}
});

// many-to-many relation with category
postSchema.virtual('categories', {
    ref: 'CategoryPost',
    localField: '_id',
    foreignField: 'postId'
});
//many-to-many relation with tag
postSchema.virtual('tags', {
    ref: 'TagPost',
    localField: '_id',
    foreignField: 'postId'
});

//morph relation with comment
postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'commentable',
});

postSchema.plugin(mongoosePaginate);
const Post = model('Post', postSchema);

module.exports = Post
