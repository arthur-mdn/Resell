// models/Brand.js
const mongoose = require('mongoose');
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
        required: true,
        default: {
            type: 'image',
            value: 'brands/default-brand.svg'
        }
    }
});

module.exports = mongoose.model('Brand', brandSchema);

