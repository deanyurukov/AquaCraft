import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";
import Order from "../src/models/Order";
import Product from "../src/models/Product";
import User from "../src/models/User";
import {
    expectUnauthorized,
    registerSuccessfulUser,
    createProduct,
    createOrder
} from "./helpers";
import { user, order } from "./test-data";

describe("POST /orders/add", () => {
    it("creates an order successfully", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const product = await createProduct();
        const registeredUser = await User.findOne({ email: user.email });

        registeredUser.productsInCart.push({
            product: product._id,
            quantity: 2
        });

        await registeredUser.save();

        const response = await request(app)
            .post("/orders/add")
            .set("X-Authorization", token)
            .send(order);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("orderSuccess");
        expect(response.body.data.orderDays).toBe(1);
        expect(response.body.data.orderData).toHaveLength(1);

        const updatedProduct = await Product.findById(product._id);
        expect(updatedProduct.inStock).toBe(8);

        const updatedUser = await User.findOne({ email: user.email });
        expect(updatedUser.productsInCart).toHaveLength(0);

        const createdOrder = await Order.findOne({ userId: registeredUser._id });
        expect(createdOrder).not.toBeNull();
    });

    it("returns an error if the cart is empty", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .post("/orders/add")
            .set("X-Authorization", token)
            .send(order);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("emptyCart");
    });

    it("returns an error if a required field is empty", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .post("/orders/add")
            .set("X-Authorization", token)
            .send({
                ...order,
                name: ""
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("allFields");
    });

    it("returns an error if the access token is invalid", async () => {
        await expectUnauthorized("post", "/orders/add");
    });
});

describe("GET /orders/getByUser", () => {
    it("returns the user's orders", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const product = await createProduct();
        const registeredUser = await User.findOne({ email: user.email });

        await createOrder(registeredUser._id, product._id);

        const response = await request(app)
            .get("/orders/getByUser")
            .set("X-Authorization", token);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Found orders!");
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].orderData[0].product.title).toBe(product.title);
    });

    it("returns an empty array if the user has no orders", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .get("/orders/getByUser")
            .set("X-Authorization", token);

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveLength(0);
    });

    it("returns an error if the access token is invalid", async () => {
        await expectUnauthorized("get", "/orders/getByUser");
    });
});

describe("GET /orders/:id", () => {
    it("returns the order if it belongs to the user", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const product = await createProduct();
        const registeredUser = await User.findOne({ email: user.email });

        const createdOrder = await createOrder(registeredUser._id, product._id);

        const response = await request(app)
            .get(`/orders/${createdOrder._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Found order data!");
        expect(response.body.data._id).toBe(createdOrder._id.toString());
        expect(response.body.data.orderData[0].product.title).toBe(product.title);
    });

    it("returns an error if the order does not exist", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .get("/orders/000000000000000000000000")
            .set("X-Authorization", token);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User or order not found.");
    });

    it("returns an error if the order ID is invalid", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .get("/orders/invalid-id")
            .set("X-Authorization", token);

        expect(response.status).toBe(400);
    });

    it("returns an error if another user tries to access the order", async () => {
        const firstRegisterResponse = await registerSuccessfulUser();
        const firstUser = await User.findOne({ email: user.email });

        const product = await createProduct();
        const createdOrder = await createOrder(firstUser._id, product._id);

        const secondUser = {
            ...user,
            email: "another@example.com"
        };

        const secondRegisterResponse = await request(app)
            .post("/users/register")
            .send(secondUser);

        const token = secondRegisterResponse.body.accessToken;

        const response = await request(app)
            .get(`/orders/${createdOrder._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("User is trying to access other people's orders.");
    });

    it("returns an error if the access token is invalid", async () => {
        await expectUnauthorized("get", "/orders/000000000000000000000000");
    });
});