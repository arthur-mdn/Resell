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
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Condition', conditionSchema);

