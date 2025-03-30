import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "allFields"]
        },
        images: {
            type: [String], // Define it as an array of strings
            required: [true, "allFields"],
            validate: [
                {
                    validator: function (arr) {
                        return arr.length <= 4; // Enforce max 5 elements
                    },
                    message: "image.exceeds",
                },
                {
                    validator: function (arr) {
                        return arr.every(url => /^https?:\/\/[^\s]+$/.test(url)); // Regex validation for each item
                    },
                    message: "image.invalid",
                },
            ],
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
    },
    {
        timestamps: true
    }
);

const Product = model("Product", productSchema);
export default Product;