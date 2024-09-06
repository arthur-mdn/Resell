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
        enum: ['image', 'icon']
    },
    value: {
        type: String,
        required: true
    },
    system: {
        type: String,
        required: false,
        default: null
    }
});

module.exports = mongoose.model('Image', imageSchema);

