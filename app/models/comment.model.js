const {Schema, model} = require('mongoose');
const commentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    commentable: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'commentableType'
    },
    commentableType: {
        type: String,
        required: true,
        enum: ['Post']
    }
});

commentSchema.virtual('commentableModel', {
    ref: (doc) => doc.commentableType, // Dynamic reference based on commentableType
    localField: 'commentable',
    foreignField: '_id',
    justOne: true,
});

const Comment = model('Comment', commentSchema);

module.exports = Comment
