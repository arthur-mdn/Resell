const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Condition = require("../models/Condition");
const Size = require("../models/Size");
const Item = require("../models/Item");
const Image = require("../models/Image");

const verifyToken = require('../others/verifyToken');
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const imageFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Seuls les fichiers image sont autorisés!'), false);
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + Math.random().toString(36).substring(2,6+2) + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: imageFilter
});

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

router.get('/item/:id', verifyToken, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('category').populate('brand').populate('condition').populate('size').populate('photos');
        res.json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/item/:id', verifyToken, upload.fields([
    { name: 'photos' }
]), async (req, res) => {
    let { title, description, category, brand, condition, size, price, photosToDelete, existingPhotos } = req.body;

    if (!title || !description || !category || !brand || !condition || !size || !price) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    price = JSON.parse(price);
    if (!price.buyPrice || !price.estimatedPrice || !price.floorPrice) {
        return res.status(400).json({ error: 'All price fields are required' });
    }

    let photos = [];

    if (req.files && req.files.photos) {
        for (const file of req.files.photos) {
            const newImage = new Image({
                user: req.user.userId,
                type: 'image',
                value: file.path,
                where: 'server'
            });
            await newImage.save();
            photos.push(newImage._id);
        }
    }

    if (existingPhotos) {
        existingPhotos = JSON.parse(existingPhotos);
        for (const photo of existingPhotos) {
            const image = await Image.findById(photo);
            if (image && image.user.toString() === req.user.userId) {
                photos.push(image._id);
            } else {
                return res.status(400).json({ error: 'You can only use your own images' });
            }
        }
    }

    if (photosToDelete) {
        const deletePhotoIds = JSON.parse(photosToDelete);
        for (const photoId of deletePhotoIds) {
            const image = await Image.findById(photoId);
            if (image && image.user.toString() === req.user.userId) {
                await Image.findByIdAndDelete(photoId);
            } else {
                return res.status(400).json({ error: 'You can only delete your own images' });
            }
        }
    }

    try {
        const item = await Item.findById(req.params.id);
        item.title = title;
        item.description = description;
        item.category = category;
        item.brand = brand;
        item.condition = condition;
        item.size = size;
        item.price = price;
        item.photos = photos;

        await item.save();
        res.json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/items', verifyToken, upload.fields([
    { name: 'photos' }
]), async (req, res) => {
    let { title, description, category, brand, condition, size, price } = req.body;

    if (!title || !description || !category || !brand || !condition || !size || !price) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    price = JSON.parse(price);
    if (!price.buyPrice || !price.estimatedPrice || !price.floorPrice) {
        return res.status(400).json({ error: 'All price fields are required' });
    }

    let photos = [];
    if (req.files && req.files.photos) {
        for (const file of req.files.photos) {
            const newImage = new Image({
                user: req.user.userId,
                type: 'image',
                value: file.path,
                where: 'server'
            });
            await newImage.save();
            photos.push(newImage._id);
        }
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
            photos
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