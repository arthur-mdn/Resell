const mongoose = require("mongoose");
const Image = require("../models/Image");
const Category = require("../models/Category");
const Condition = require("../models/Condition");
const Size = require("../models/Size");
const Brand = require("../models/Brand");
const images = require("../datas/images.json");
const categories = require("../datas/categories.json");
const conditions = require("../datas/conditions.json");
const sizes = require("../datas/sizes.json");
const brands = require("../datas/brands.json");

const imageIds = {};
const categoryIds = {};
const conditionIds = {};

async function initDatabase() {
    try {
        await initImages();
        await initCategories();
        await initConditions();
        await initSizes();
        await initBrands();
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

async function insertImageIfNotExists(imageKey) {
    const imageData = images[imageKey];
    if (!imageData) {
        throw new Error(`Image data for key ${imageKey} not found in JSON file`);
    }

    const existingImage = await Image.findOne({ system: imageData.system });
    if (existingImage) {
        console.log(`Image ${imageKey} already exists with ID: ${existingImage._id}`);
        imageIds[imageKey] = existingImage._id;
    } else {
        const newImage = new Image(imageData);
        const savedImage = await newImage.save();
        console.log(`Image ${imageKey} inserted with ID: ${savedImage._id}`);
        imageIds[imageKey] = savedImage._id;
    }
}

async function initImages() {
    try {
        for (const imageKey in images) {
            await insertImageIfNotExists(imageKey);
        }
        console.log("Image initialization complete.");
    } catch (error) {
        console.error("Error initializing images:", error);
    }
}

async function initCategories() {
    try {
        for (const categoryName in categories) {
            const categoryData = categories[categoryName];
            await insertCategoryWithSubCategories(categoryData, null); // null = catégorie de premier niveau
        }
        console.log("Category initialization complete.");
    } catch (error) {
        console.error("Error initializing categories:", error);
    }
}

async function insertCategoryWithSubCategories(categoryData, parentCategoryId) {
    const existingCategory = await Category.findOne({ name: categoryData.name });

    let categoryId;
    if (existingCategory) {
        console.log(`Category ${categoryData.name} already exists with ID: ${existingCategory._id}`);
        categoryId = existingCategory._id;
    } else {
        const newCategory = new Category({
            name: categoryData.name,
            user: categoryData.user || null,
            parentCategory: parentCategoryId,
            subCategories: [],
            image: imageIds[categoryData.image] || imageIds['default-category']
        });

        const savedCategory = await newCategory.save();
        console.log(`Category ${categoryData.name} inserted with ID: ${savedCategory._id}`);
        categoryId = savedCategory._id;
    }

    if (categoryData.subCategories && categoryData.subCategories.length > 0) {
        let subCategoryIds = [];
        for (const subCategory of categoryData.subCategories) {
            const subCategoryId = await insertCategoryWithSubCategories(subCategory, categoryId);
            subCategoryIds.push(subCategoryId);
        }

        await Category.findByIdAndUpdate(categoryId, { subCategories: subCategoryIds });
        console.log(`Category ${categoryData.name} updated with subCategories: ${subCategoryIds}`);
    }

    return categoryId;
}

async function initSizes() {
    try {
        const sizeList = Object.values(sizes);
        for (const size of sizeList) {
            const existingSize = await Size.findOne({ name: size.name });
            if (!existingSize) {
                const category = await Category.findOne({ name: size.category });

                const sizeData = {
                    category: category ? category._id : null,
                    sort: size.sort,
                    name: size.name
                };

                const newSize = new Size(sizeData);
                await newSize.save();
                console.log(`Size ${size.name} inserted.`);
            } else {
                console.log(`Size ${size.name} already exists.`);
            }
        }
        console.log("Size initialization complete.");
    } catch (error) {
        console.error("Error initializing sizes:", error);
    }
}

async function initConditions() {
    try {
        const conditionList = Object.values(conditions);
        for (const condition of conditionList) {
            const existingCondition = await Condition.findOne({ title: condition.title });
            if (!existingCondition) {
                const conditionData = {
                    condition: condition.condition,
                    title: condition.title,
                    image: imageIds[condition.image] || imageIds['default-condition']
                };
                const newCondition = new Condition(conditionData);
                await newCondition.save();
                console.log(`Condition ${condition.title} inserted.`);
            } else {
                console.log(`Condition ${condition.title} already exists.`);
            }
        }
        console.log("Condition initialization complete.");
    } catch (error) {
        console.error("Error initializing conditions:", error);
    }
}

async function initBrands() {
    try {
        const brandList = Object.values(brands);
        for (const brand of brandList) {
            const existingBrand = await Brand.findOne({ name: brand.name });
            if (!existingBrand) {
                const newBrand = new Brand({
                    name: brand.name,
                    image: imageIds[brand.image] || imageIds['default-brand']
                });
                await newBrand.save();
                console.log(`Brand ${brand.name} inserted.`);
            } else {
                console.log(`Brand ${brand.name} already exists.`);
            }
        }
        console.log("Brand initialization complete.");
    }
    catch (error) {
        console.error("Error initializing brands:", error);
    }
}

module.exports = initDatabase;