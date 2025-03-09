import { Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "allFields"],
        minLength: [3, "username.short"],
        maxLength: [99, "username.long"],
        match: [/^[a-zA-Z0-9\s]+$/, "username.invalid"],
    },
    email: {
        type: String,
        required: [true, "allFields"],
        minLength: [5, "email.short"],
        maxLength: [99, "email.long"],
        match: [/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, "email.invalid"],
    },
    password: {
        type: String,
        required: [true, "allFields"],
        minLength: [6, "password.short"],
        maxLength: [99, "password.long"],
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
    isAdmin: {
        type: Boolean,
        default: false,
    }
});

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

const User = model("User", userSchema);
export default User;