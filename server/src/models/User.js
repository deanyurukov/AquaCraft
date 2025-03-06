import { Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Попълнете всички полета!"],
        minLength: [3, "Името трябва да е поне 3 символа!"],
        maxLength: [99, "Името не може да бъде над 99 символа!"],
        match: [/^[a-zA-Z0-9\s]+$/, "Името трябва да включва само букви и цифри!"],
    },
    email: {
        type: String,
        required: [true, "Попълнете всички полета!"],
        minLength: [5, "Имейлът трябва да е поне 5 символа!"],
        maxLength: [99, "Имейлът не може да бъде над 99 символа!"],
        match: [/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, "Имейлът е невалиден!"],
    },
    password: {
        type: String,
        required: [true, "Попълнете всички полета!"],
        minLength: [6, "Паролата трябва да е поне 6 символа!"],
        maxLength: [99, "Паролата не може да бъде над 99 символа!"],
    },
    productsInCart: [{
        _id: false,
        quantity: {
            type: Number,
            default: 1,
        },
        product: {
            type: Types.ObjectId,
            ref: "Product",
            required: true,
        }
    }],
    favorites: [{
        type: Types.ObjectId,
        ref: "Product",
        required: true,
    }],
});

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

const User = model("User", userSchema);
export default User;