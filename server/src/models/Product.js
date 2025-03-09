import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: {
        type: String,
        required: [true, "allFields"],
        match: [/^[a-zа-яА-ЯA-Z0-9\s]+$/, "name.invalid"]
    },
    imageUrl: {
        type: String,
        required: [true, "allFields"],
        match: [/(http[s]*:\/\/)([a-z\-_0-9\/.]+)\.([a-z.]{2,3})\/([a-z0-9\-_\/._~:?#\[\]@!$&'()*+,;=%]*)([a-z0-9]+\.)(jpg|jpeg|png)/i, "image.invalid"]
    },
    description: {
        type: String,
        required: [true, "allFields"],
        minLength: [10, "description.short"]
    },
    price: {
        type: Number,
        required: [true, "allFields"],
        min: [0, "price.low"],
    }
});

const Product = model("Product", productSchema);
export default Product;