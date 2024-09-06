// models/Size.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const sizeSchema = new Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    sort: { // pour trier les tailles dans l'ordre
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Size', sizeSchema);

