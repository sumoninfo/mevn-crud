const {Schema, model} = require('mongoose');
const tagSchema = new Schema({
    title: String,
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
}, {
    toJSON: {virtuals: true}
});

tagSchema.virtual('posts', {
    ref: 'PostTag',
    localField: '_id',
    foreignField: 'tagId'
});


const Tag = model('Tag', tagSchema);

module.exports = Tag
