const {Schema, model} = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");

const categorySchema = new Schema({
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

categorySchema.virtual('posts', {
    ref: 'CategoryPost',
    localField: '_id',
    foreignField: 'categoryId'
});

categorySchema.plugin(mongoosePaginate);

const Category = model('Category', categorySchema);

module.exports = Category
