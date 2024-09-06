// models/Image.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    },
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

module.exports = mongoose.model('Image', imageSchema);

