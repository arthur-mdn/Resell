// models/Size.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const sizeSchema = new Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Size', sizeSchema);

