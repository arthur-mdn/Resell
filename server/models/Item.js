// models/Item.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    condition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Condition',
        required: true
    },
    size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size',
        required: true
    },
    price:{
        buyPrice: {
            type: Number,
            required: true
        },
        estimatedPrice: {
            type: Number,
            required: true
        },
        floorPrice: {
            type: Number,
            required: true
        }
    },
    photos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: false
    }],
    creation: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["ok", "del", "draft"],
        required: true,
        default: "ok"
    }
});

module.exports = mongoose.model('Item', itemSchema);

