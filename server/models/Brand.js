// models/Brand.js
const mongoose = require('mongoose');
const Image = require("./Image");
const { Schema } = mongoose;

const brandSchema = new Schema({
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
    }
});

brandSchema.pre('save', async function (next) {
    if (!this.image) {
        const defaultImage = await Image.findOne({ system: 'default-brand' });
        if (defaultImage) {
            this.image = defaultImage._id;
        } else {
            const newImage = new Image({
                type: 'image',
                value: 'brands/default-brand.svg',
                system: 'default-brand'
            });
            await newImage.save();
            this.image = newImage._id;
        }
    }
    next();
});

module.exports = mongoose.model('Brand', brandSchema);

