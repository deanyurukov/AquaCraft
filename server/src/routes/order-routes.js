import express from 'express';
import Order from '../models/Order.js';
import { isUserValid } from '../utils/auth-util.js';
import User from '../models/User.js';
import { getErrorMessage } from '../utils/error-util.js';
import Product from '../models/Product.js';

const router = express.Router();

router.post("/add", async (req, res) => {
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

        let orderDays = 1;

        user.productsInCart.forEach(async (productData) => {
            order.orderData.push(productData);
            const product = await Product.findById(productData.product._id);
            product.inStock -= productData.quantity;

            if (product.inStock < 0) {
                orderDays += 2;
            }

            await product.save();
        });

        let orderData = {};

        try {
            orderData = await Order.create(order);
            orderData = orderData.toObject();
            orderData.orderDays = orderDays;
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

router.get('/getByUser', async (req, res) => {
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

router.get("/all", async (req, res) => {
    const orders = await Order.find({}).sort("-createdAt").populate("orderData.product");
    return res.status(200).send({ data: orders });
});

router.get("/:id", async (req, res) => {
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

router.get("/complete/:id", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid && data.isAdmin) {
        const id = req.params.id;

        try {
            const order = await Order.findById(id);
            order.isCompleted = true;
            await order.save();

            return res.status(200).send({ message: "Order Completed" });
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

export default router;