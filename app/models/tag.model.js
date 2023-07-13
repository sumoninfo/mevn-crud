const {Schema, model} = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const tagSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
}, {
    toJSON: {virtuals: true}
});

tagSchema.virtual('posts', {
    ref: 'TagPost',
    localField: '_id',
    foreignField: 'tagId'
});

tagSchema.plugin(mongoosePaginate);
const Tag = model('Tag', tagSchema);

module.exports = Tag
