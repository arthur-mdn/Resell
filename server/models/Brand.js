// models/Brand.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const brandImageSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enumerable: ['image', 'icon']
    },
    value: {
        type: String,
        required: true
    }
});

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
        type: brandImageSchema,
        required: true,
        default: {
            type: 'image',
            value: 'brands/default-brand.svg'
        }
    }
});

module.exports = mongoose.model('Brand', brandSchema);

