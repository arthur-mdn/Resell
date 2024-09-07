import React, { useState } from "react";
import CategorySelector from "./selectors/CategorySelector";
import BrandSelector from "./selectors/BrandSelector";
import ConditionSelector from "./selectors/ConditionSelector";
import SizeSelector from "./selectors/SizeSelector";
import PriceSelector from "./selectors/PriceSelector.jsx";
import axios from "axios";
import config from "../../config";
import { useLanguage } from "../../LanguageContext.jsx";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaTimes } from "react-icons/fa";

function AddItem() {
    const { translations } = useLanguage();

    const [itemData, setItemData] = useState({
        title: "",
        description: "",
        category: "",
        brand: "",
        condition: "",
        size: "",
        price: {
            buyPrice: "",
            estimatedPrice: "",
            floorPrice: "",
        },
        photos: []
    });
    const [error, setError] = useState("");

    const onDrop = (acceptedFiles) => {
        setItemData({
            ...itemData,
            photos: [...itemData.photos, ...acceptedFiles]
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: true
    });

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const updatedPhotos = Array.from(itemData.photos);
        const [reorderedPhoto] = updatedPhotos.splice(result.source.index, 1);
        updatedPhotos.splice(result.destination.index, 0, reorderedPhoto);

        setItemData({ ...itemData, photos: updatedPhotos });
    };

    const removePhoto = (index) => {
        const updatedPhotos = itemData.photos.filter((_, i) => i !== index);
        setItemData({ ...itemData, photos: updatedPhotos });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, description, category, brand, condition, size, price, photos } = itemData;

        if (!title || !description || !category || !brand || !condition || !size || !price.buyPrice || !price.estimatedPrice || !price.floorPrice) {
            setError("All fields are required");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('brand', brand);
        formData.append('condition', condition);
        formData.append('size', size);
        formData.append('price', JSON.stringify(price));

        console.log(photos)
        photos.forEach((photo, index) => {
            formData.append(`photos`, photo);
        });

        console.log([...formData]);

        try {
            const response = await axios.post(`${config.serverUrl}/items`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log("Item created:", response.data);
            setItemData({
                title: "",
                description: "",
                category: "",
                brand: "",
                condition: "",
                size: "",
                price: {
                    buyPrice: "",
                    estimatedPrice: "",
                    floorPrice: "",
                },
                photos: []
            });
        } catch (error) {
            console.error("Error creating item:", error);
            setError("Error creating item");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="fc g1 p1">
                <h2>{translations.addAnItem}</h2>

                <label>{translations.photos}</label>
                <div className="import-photos" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="dropzone">
                        {isDragActive ? (
                            <p>{translations.dropPhotosHere}</p>
                        ) : (
                            <p>{translations.importPhotos}</p>
                        )}
                    </div>
                </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="photos" direction="horizontal">
                        {(provided) => (
                            <div className="photos-preview" {...provided.droppableProps} ref={provided.innerRef}>
                                {itemData.photos.map((photo, index) => (
                                    <Draggable key={index} draggableId={`photo-${index}`} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="photo-preview"
                                            >
                                                <img src={URL.createObjectURL(photo)} alt={`photo-${index}`} />
                                                <button className="remove-photo-btn" onClick={() => removePhoto(index)}>
                                                    <FaTimes size={12}/>
                                                </button>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <div className={"input_container"}>
                    <label htmlFor="title">
                        {translations.itemTitle}
                    </label>
                    <input
                        type="text"
                        id={"title"}
                        name="title"
                        value={itemData.title}
                        onChange={(e) => setItemData({ ...itemData, title: e.target.value })}
                        placeholder={translations.itemTitle}
                        required
                    />
                </div>

                <div className={"input_container"}>
                    <label htmlFor="description">
                        {translations.itemDescription}
                    </label>
                    <textarea
                        id={"description"}
                        name="description"
                        value={itemData.description}
                        onChange={(e) => setItemData({ ...itemData, description: e.target.value })}
                        placeholder={translations.itemDescription}
                        required
                    />
                </div>

            </div>

            <CategorySelector onCategorySelect={(category) => setItemData({ ...itemData, category: category._id })} />
            <SizeSelector categoryId={itemData.category} onSizeSelect={(size) => setItemData({ ...itemData, size: size._id })} />
            <BrandSelector onBrandSelect={(brand) => setItemData({ ...itemData, brand: brand._id })} />
            <ConditionSelector onConditionSelect={(condition) => setItemData({ ...itemData, condition: condition._id })} />
            <PriceSelector onPriceSelect={(price) => setItemData({ ...itemData, price: price })} />

            <div className={"fc g1 p1"}>
                <button type="submit">
                    {translations.addItem}
                </button>
                {error && <p>{error}</p>}
            </div>
        </form>
    );
}

export default AddItem;