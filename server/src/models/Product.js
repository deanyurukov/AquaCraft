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
        match: [/https?:\/\/[^\s]+/, "image.invalid"]
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
    },
    inStock: {
        type: Number,
        required: [true, "allFields"],
    },
    company: {
        type: String,
        required: [true, "allFields"],
        enum: [
            "hunter",
            "rainBird",
            "rainSpa",
            "irritec"
        ]
    },
    type: {
        type: String,
        required: [true, "allFields"],
        enum: [
            "timers",
            "sprinklers",
            "valves",
            "drip",
            "bundles",
            "exclusive",
            "parts"
        ]
    },
    typeDetails: {
        type: String,
        required: [true, "allFields"],
    }
});

const Product = model("Product", productSchema);
export default Product;