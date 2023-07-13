const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const authorSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive'],
            message: '{VALUE} is not supported'
        },
        default: 'active'
    },
}, {
    toJSON: {virtuals: true}
});

// one-to-many relation with posts
authorSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author'
});

authorSchema.plugin(mongoosePaginate);
const Author = model('Author', authorSchema);

module.exports = Author
