import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

import User from "./models/User.js";
import Product from './models/Product.js';
import { isUserValid } from './utils/auth-util.js';
import { getErrorMessage } from './utils/error-util.js';
import Order from './models/Order.js';

const app = express();
dotenv.config({ path: "../.env" });

const uri = process.env.URI_KEY || "mongodb://0.0.0.0:27017/Aqua-Craft";
// const uri = "mongodb://0.0.0.0:27017/Aqua-Craft";
export const secret = process.env.JWT_SECRET || "baughgu98iyuuyhtg";
const port = process.env.PORT || 5001;
const allowedOrigins = ['https://www.aquacraft.ltd'];

try {
    await mongoose.connect(uri);
    console.log('Connected to DB Successfully');
} catch (err) {
    console.error('Cannot connect to DB!');
    console.log(err.message);
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin); // Dynamic Origin
        res.setHeader('Access-Control-Allow-Credentials', 'true'); // If sending cookies or auth headers
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Authorization');

    next();
});

app.options('*', (req, res) => {
    return res.status(204).send();
});

app.post('/users/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send({ message: 'allFields' });
    }

    const userExists = await User.countDocuments({ email: email.trim() });

    if (userExists !== 0) {
        return res.status(409).send({ message: 'email.exists' });
    }

    const user = {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        isAdmin: false,
    };

    try {
        await User.create(user);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send({ message: getErrorMessage(err) });
    }

    const token = jwt.sign(user, secret);

    return res.status(201).send({ message: 'registerSuccess', accessToken: token });
});

app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(409).send({ message: 'allFields' });
    }

    const user = await User.findOne({ email: email.trim() });

    if (!user) {
        return res.status(404).send({ message: 'email.noProfile' });
    }

    const passwordsAreSame = await bcrypt.compare(password.trim(), user.password);

    if (!passwordsAreSame) {
        return res.status(401).send({ message: 'password.wrong' });
    }

    const userData = {
        email: user.email,
        username: user.username,
        password: user.password,
        isAdmin: user.isAdmin,
    }

    const token = jwt.sign(userData, secret);

    return res.status(200).send({ message: 'loginSuccess', accessToken: token });
});

app.get("/users/logout", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid) {
        const user = await User.findOne({ email: data.email });

        return res.status(200).send({ message: "logoutSuccess", data: user });
    }
    else {
        return res.status(401).send({ message });
    }
});

app.get('/users/getAuth', async (req, res) => {
    const [isValid, message] = await isUserValid(req.headers["x-authorization"]);
    return res.status(200).send({ isValid, message });
});

app.get('/users/userData', async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);
    return res.status(200).send({ data });
});

app.put("/users/changeUserData", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);
    const { email: newEmail, username: newUsername, password } = req.body;

    if (isValid) {
        const user = await User.findOne({ email: data.email });

        if (newEmail === user.email && newUsername === user.username) {
            return res.status(400).send({ message: "changeData" });
        }

        const usersWithThisEmail = await User.countDocuments({ email: newEmail });

        if (usersWithThisEmail > 0 && newEmail !== data.email) {
            return res.status(409).send({ message: "email.exists" });
        }

        const isPasswordSame = await bcrypt.compare(password, user.password);

        if (!isPasswordSame) {
            return res.status(403).send({ message: "password.wrong" });
        }

        user.email = newEmail;
        user.username = newUsername;

        const userToken = {
            username: newUsername.trim(),
            email: newEmail.trim(),
            password: password.trim(),
            isAdmin: user.isAdmin,
        };

        const token = jwt.sign(userToken, secret);

        try {
            await user.save();
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }

        return res.status(200).send({ message: "dataChangeSuccess", accessToken: token });
    }
    else {
        return res.status(401).send({ message });
    }
});

app.put("/users/changeUserPassword", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);
    const { password, new_password } = req.body;

    if (isValid) {
        const user = await User.findOne({ email: data.email });

        const isPasswordSame = await bcrypt.compare(password, user.password);

        if (!isPasswordSame) {
            return res.status(403).send({ message: "password.wrong" });
        }

        user.password = new_password;

        const userToken = {
            username: user.username,
            email: user.email,
            password: new_password.trim(),
            isAdmin: user.isAdmin,
        };

        const token = jwt.sign(userToken, secret);

        try {
            await user.save();
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }

        return res.status(200).send({ message: "passwordChangeSuccess", accessToken: token });
    }
    else {
        return res.status(401).send({ message });
    }
});

app.get("/products/getAll", async (req, res) => {
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

app.get("/products/:id", async (req, res) => {
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

app.post("/products/addToCart/:id", async (req, res) => {
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

app.get("/products/get/id", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid) {
        const productsInCart = (await User.findOne({ email: data.email }).populate("productsInCart.product")).productsInCart;
        return res.status(200).send({ message: "Има продукти в кошницата", data: productsInCart });
    }
    else {
        return res.status(401).send({ message });
    }
});

app.put("/products/:id", async (req, res) => {
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

app.delete("/products/:id", async (req, res) => {
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

app.post("/addOrder", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);
    const { name, town, phone, email, deliveryWay } = req.body;

    if (isValid) {
        if (name === "" || town === "" || phone === "" || email === "" || deliveryWay === "") {
            return res.status(409).send({ message: 'allFields' });
        }

        const user = await User.findOne({ email: data.email });

        if (user.productsInCart.length === 0) {
            return res.status(403).send({ message: "emptyCart" });
        }

        const order = {
            name,
            town: town.toLowerCase(),
            phone,
            email,
            deliveryWay,
            userId: user._id,
            orderData: []
        };

        user.productsInCart.forEach(async (productData) => {
            order.orderData.push(productData);
            const product = await Product.findById(productData.product._id);
            product.inStock -= productData.quantity;
            await product.save();
        });

        let orderData = {};

        try {
            orderData = await Order.create(order);
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }

        user.productsInCart = [];
        await user.save();

        return res.status(201).send({ message: "orderSuccess", data: orderData });
    }
    else {
        return res.status(401).send({ message });
    }
});

app.get('/orders/getByUser', async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid) {
        const user = await User.findOne({ email: data.email });

        try {
            const userOrders = await Order.find({ userId: user._id }).sort("-createdAt").populate("orderData.product");
            return res.status(201).send({ message: "Found orders!", data: userOrders });
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }
    }
    else {
        return res.status(401).send({ message });
    }
});

app.get("/orders/:id", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid) {
        const id = req.params.id;

        try {
            const user = await User.findOne({ email: data.email });
            const order = await Order.findOne({ _id: id }).populate("orderData.product").lean();

            if (order.orderData) {
                order.orderData.map(({ quantity, product }) => {
                    if (user.favorites.includes(product._id.toString())) {
                        product.isFav = true;
                    }
                });
            }

            return res.status(201).send({ message: "Found order data!", data: order });
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }
    }
    else {
        return res.status(401).send({ message });
    }
});

app.get("/products/favorites/get", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid) {
        const user = await User.findOne({ email: data.email }).populate("favorites");

        return res.status(201).send({ message: "Има харесани продукти.", data: user.favorites });
    }
    else {
        return res.status(401).send({ message, data: [] });
    }
});

app.post("/products/favorites/add/:id", async (req, res) => {
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

app.post("/products/favorites/remove/:id", async (req, res) => {
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

app.post("/products/addOne", async (req, res) => {
    const { title, images, price, description, inStock, company, type, typeDetails } = req.body;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    const imagesArray = images.split(",");

    if (isValid && data.isAdmin) {
        try {
            await Product.create({ title, images: imagesArray, price, description, inStock, company, type, typeDetails });
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }

        return res.status(201).send({ message: "productCreated" });
    }
    else {
        return res.status(401).send({ message });
    }
});

app.post("/products/changeInStock/:id", async (req, res) => {
    const { changedStock } = req.body;
    const productId = req.params.id;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid && data.isAdmin) {
        try {
            const product = await Product.findById(productId);
            product.inStock += Number(changedStock);
            await product.save();
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }

        return res.status(201).send({ message: "productCreated" });
    }
    else {
        return res.status(401).send({ message });
    }
});

app.delete("/products/delete/:id", async (req, res) => {
    const productId = req.params.id;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid && data.isAdmin) {
        try {
            await Product.findByIdAndDelete(productId);
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }

        return res.status(201).send({ message: "productDeleted" });
    }
    else {
        return res.status(401).send({ message });
    }
});

app.put("/products/change/:id", async (req, res) => {
    const productId = req.params.id;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);
    const { title, images, price, description, inStock, company, type, typeDetails } = req.body;
    const imagesArray = images.split(",");

    if (isValid && data.isAdmin) {
        try {
            await Product.findByIdAndUpdate(productId, { title, images: imagesArray, price, description, inStock, company, type, typeDetails }, { runValidators: true });
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }

        return res.status(201).send({ message: "productUpdated" });
    }
    else {
        return res.status(401).send({ message });
    }
});

app.all("*", function (req, res) {
    return res.status(404).send({ message: "Route not found." });
});

app.listen(port, () => console.log('Server is running on http://localhost:5001...'));