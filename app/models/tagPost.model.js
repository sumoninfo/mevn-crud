const {Schema, model} = require('mongoose');
const tagPostSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    tagId: {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
        required: true
    }
});

const TagPost = model('TagPost', tagPostSchema);

module.exports = TagPost
