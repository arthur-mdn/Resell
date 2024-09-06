// models/Category.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const Image = require('./Image');

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
        required: false
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

categorySchema.pre('save', async function (next) {
    if (!this.image) {
        const defaultImage = await Image.findOne({ system: 'default-category' });
        if (defaultImage) {
            this.image = defaultImage._id;
        } else {
            const newImage = new Image({
                type: 'image',
                value: 'categories/default-category.svg',
                system: 'default-category'
            });
            await newImage.save();
            this.image = newImage._id;
        }
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);

