import express from "express";
import { isUserValid } from "../utils/auth-util.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/get/all", async (req, res) => {
    const products = await Product.find().lean();
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);
    const user = await User.findOne({ email: data.email });

    if (user) {
        products.map(product => {
            if (user.favorites.includes(product._id.toString())) {
                product.isFav = true;
            }
        });
    }

    return res.status(200).send({ data: products });
});

router.post("/cart/add/:id", async (req, res) => {
    const { id } = req.params;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid) {
        const user = await User.findOne({ email: data.email });

        const productsIds = user.productsInCart.map(product => product.product.toString());

        if (productsIds.includes(id)) {
            return res.status(409).send({ message: "productInCart" });
        }

        user.productsInCart.push({ product: id });
        await user.save();

        return res.status(201).send({ message: "Продуктът е добавен успешно" });
    }
    else {
        return res.status(401).send({ message });
    }
});

router.get("/cart/get", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid) {
        const productsInCart = (await User.findOne({ email: data.email }).populate("productsInCart.product")).productsInCart;
        return res.status(200).send({ message: "Има продукти в кошницата", data: productsInCart });
    }
    else {
        return res.status(401).send({ message });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);
    const user = await User.findOne({ email: data.email });

    try {
        const product = await Product.findById(id).lean();

        if (user && user.favorites.includes(product._id.toString())) {
            product.isFav = true;
        }

        return res.status(200).send({ message: "Product found", data: product });
    }
    catch (err) {
        return res.status(404).end("Error retrieving product.");
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid) {
        const user = await User.findOne({ email: data.email });

        const quantityToChange = user.productsInCart.find(({ quantity, product }) => product.toString() === id);
        quantityToChange.quantity = quantity;

        await user.save();

        res.status(200).send({ message: "Quantity updated successfully.", products: user.productsInCart });
    }
    else {
        res.status(401).send({ message });
    }

});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid) {
        const user = await User.findOne({ email: data.email });

        const indexToRemove = user.productsInCart.indexOf(user.productsInCart.find(({ quantity, product }) => product.toString() === id));

        user.productsInCart.splice(indexToRemove, 1);

        await user.save();
        return res.status(200).send({ message: "Product deleted successfully." });
    }
    else {
        return res.status(401).send({ message });
    }
});

router.get("/favorites/get", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid) {
        const user = await User.findOne({ email: data.email }).populate("favorites");

        return res.status(201).send({ message: "Има харесани продукти.", data: user.favorites });
    }
    else {
        return res.status(401).send({ message, data: [] });
    }
});

router.post("/favorites/add/:id", async (req, res) => {
    const { id } = req.params;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid) {
        const user = await User.findOne({ email: data.email });

        const productsIds = user.favorites.map(product => product.toString());

        if (productsIds.includes(id)) {
            return res.status(409).send({ message: "Продуктът вече е харесан!" });
        }

        user.favorites.push(id);
        await user.save();

        return res.status(201).send({ message: "Продуктът е харесан успешно." });
    }
    else {
        return res.status(401).send({ message });
    }
});

router.post("/favorites/remove/:id", async (req, res) => {
    const { id } = req.params;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid) {
        const user = await User.findOne({ email: data.email });

        const productsIds = user.favorites.map(product => product.toString());

        if (!productsIds.includes(id)) {
            return res.status(409).send({ message: "Продуктът не е харесан!" });
        }

        user.favorites.splice(user.favorites.indexOf(id), 1);
        await user.save();

        return res.status(201).send({ message: "Продуктът е премахнат успешно." });
    }
    else {
        return res.status(401).send({ message });
    }
});

export default router;