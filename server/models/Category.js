// models/Category.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true,
        default: {
            type: 'image',
            value: 'categories/default-category.svg'
        }
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    subCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
        default: []
    }]
});

module.exports = mongoose.model('Category', categorySchema);

