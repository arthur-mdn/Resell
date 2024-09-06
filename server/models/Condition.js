// models/Condition.js
const mongoose = require('mongoose');
const Image = require("./Image");
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
        required: false
    }
});

conditionSchema.pre('save', async function (next) {
    if (!this.image) {
        const defaultImage = await Image.findOne({ system: 'default-condition' });
        if (defaultImage) {
            this.image = defaultImage._id;
        } else {
            const newImage = new Image({
                type: 'image',
                value: 'conditions/default-condition.svg',
                system: 'default-condition'
            });
            await newImage.save();
            this.image = newImage._id;
        }
    }
    next();
});

module.exports = mongoose.model('Condition', conditionSchema);

