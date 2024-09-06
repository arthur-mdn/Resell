// models/Size.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const sizeSchema = new Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    sort: { // Used to order sizes in the UI
        type: Number,
        required: true,
        default: 0
    },
    size: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Size', sizeSchema);

