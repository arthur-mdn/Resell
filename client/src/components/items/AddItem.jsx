import React, {useEffect, useState} from "react";
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
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";

function AddItem() {
    const { translations } = useLanguage();
    const { id } = useParams();
    const navigate = useNavigate();

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
    const [photosToDelete, setPhotosToDelete] = useState([]);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const itemResponse = await axios.get(`${config.serverUrl}/item/${id}`, { withCredentials: true });
                    const item = itemResponse.data;
                    setItemData({
                        title: item.title,
                        description: item.description,
                        category: item.category._id,
                        brand: item.brand._id,
                        condition: item.condition._id,
                        size: item.size._id,
                        price: item.price,
                        photos: item.photos
                    });
                    console.log(item.photos);
                } catch (error) {
                    console.error("Error fetching data", error);
                }
            };
            fetchData();
        } else {
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
        }
    }, [id]);

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
        const photoToRemove = itemData.photos[index];
        if (!(photoToRemove instanceof File)) {
            setPhotosToDelete([...photosToDelete, photoToRemove]);
        }
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

        const alreadyUploadedPhotos = photos.filter(photo => !(photo instanceof File));
        const newPhotos = photos.filter(photo => photo instanceof File);

        newPhotos.forEach((photo) => {
            formData.append('photos', photo);
        });

        formData.append('photosToDelete', JSON.stringify(photosToDelete));

        formData.append('existingPhotos', JSON.stringify(alreadyUploadedPhotos));

        console.log([...formData]);

        try {
            const response = await axios.post(id ? `${config.serverUrl}/item/${id}` : `${config.serverUrl}/items`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log("Item created:", response.data);
            toast.success(id ? translations.itemUpdated : translations.itemCreated);
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
            setPhotosToDelete([]);
            navigate(`/item/${response.data._id}/view`);

        } catch (error) {
            console.error("Error creating item:", error);
            setError("Error creating item");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="fc g1 p1">
                <h2>{id ? translations.editItem : translations.addAnItem}</h2>

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
                                                <img src={photo.value ? ((photo.where === "server" ? config.serverUrl + "/" : "") + photo.value) : URL.createObjectURL(photo)} alt={`photo-${index}`} />
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

            <CategorySelector onCategorySelect={(category) => setItemData({ ...itemData, category: category._id })} initialCategory={itemData.category} />
            <SizeSelector categoryId={itemData.category} onSizeSelect={(size) => setItemData({ ...itemData, size: size._id })} initialSize={itemData.size}/>
            <BrandSelector onBrandSelect={(brand) => setItemData({ ...itemData, brand: brand._id })} initialBrand={itemData.brand} />
            <ConditionSelector onConditionSelect={(condition) => setItemData({ ...itemData, condition: condition._id })} initialCondition={itemData.condition} />
            <PriceSelector onPriceSelect={(price) => setItemData({ ...itemData, price: price })} initialPrice={itemData.price} />

            <div className={"fc g1 p1"}>
                <button type="submit">
                    {id ? translations.editItem : translations.addItem}
                </button>
                {error && <p>{error}</p>}
            </div>
        </form>
    );
}

export default AddItem;