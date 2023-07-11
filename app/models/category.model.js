const {Schema, model} = require('mongoose');
const categorySchema = new Schema({
    title: String,
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
}, {
    toJSON: {virtuals: true}
});

categorySchema.virtual('posts', {
    ref: 'CategoryPost',
    localField: '_id',
    foreignField: 'categoryId'
});


const Category = model('Category', categorySchema);

module.exports = Category
