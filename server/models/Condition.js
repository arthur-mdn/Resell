// models/Condition.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const conditionSchema = new Schema({
    condition: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true,
        default: {
            type: 'image',
            value: 'conditions/default-condition.svg'
        }
    }
});

module.exports = mongoose.model('Condition', conditionSchema);

