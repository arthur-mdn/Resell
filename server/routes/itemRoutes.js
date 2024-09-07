const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Condition = require("../models/Condition");
const Size = require("../models/Size");
const Item = require("../models/Item");

const verifyToken = require('../others/verifyToken');
const express = require("express");
const router = express.Router();

router.get('/items', verifyToken, async (req, res) => {
    try {
        const items = await Item.find(
            {user: req.user.userId},
        ).populate('category').populate('brand').populate('condition').populate('size').populate('photos');
        res.json(items);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/items', verifyToken, async (req, res) => {
    const { title, description, category, brand, condition, size, photos, price } = req.body;

    if (!title || !description || !category || !brand || !condition || !size || !price.buyPrice || !price.estimatedPrice || !price.floorPrice) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newItem = new Item({
            user: req.user.userId,
            title,
            description,
            category,
            brand,
            condition,
            size,
            price,
            photos: photos || []
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/items/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/items/sizes/:category', async (req, res) => {
    try {
        let category = await Category.findById(req.params.category);
        let sizes = await Size.find({ category: category._id });
        while (sizes.length === 0 && category.parentCategory) {
            category = await Category.findById(category.parentCategory);
            sizes = await Size.find({ category: category._id });
        }

        if (sizes.length === 0) {
            sizes = await Size.find({ category: null });
        }

        res.json(sizes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/items/brands', async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/items/conditions', async (req, res) => {
    try {
        const conditions = await Condition.find();
        res.json(conditions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



module.exports = router;