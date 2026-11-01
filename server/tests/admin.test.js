
import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";
import Product from "../src/models/Product";
import Order from "../src/models/Order";
import User from "../src/models/User";
import {
    registerSuccessfulUser,
    registerAdmin,
    createProduct,
    createOrder
} from "./helpers";
import { user, product } from "./test-data";

describe("Admin middleware", () => {
    it("allows an admin to access admin routes", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .get("/admin/orders/all")
            .set("X-Authorization", token);

        expect(response.status).toBe(200);
    });

    it("returns an error if the user is not an admin", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .get("/admin/orders/all")
            .set("X-Authorization", token);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Route is only available for an admin.");
    });

    it("returns an error if the access token is invalid", async () => {
        const response = await request(app)
            .get("/admin/orders/all")
            .set("X-Authorization", "wrong-token");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("authNeeded");
    });
});

describe("GET /admin/export", () => {
    it("exports products successfully", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        await createProduct();

        const response = await request(app)
            .get("/admin/export")
            .set("X-Authorization", token)
            .buffer(true)
            .parse((res, callback) => {
                const chunks = [];

                res.on("data", chunk => chunks.push(chunk));
                res.on("end", () => callback(null, Buffer.concat(chunks)));
            });

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toContain(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        expect(response.headers["content-disposition"]).toContain("report.xlsx");
        expect(response.body.length).toBeGreaterThan(0);
    });
});

describe("POST /admin/create", () => {
    it("creates a product successfully", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .post("/admin/create")
            .set("X-Authorization", token)
            .send({
                ...product,
                images: product.images.join(",")
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("productCreated");
        expect(response.body.data.title).toBe(product.title);

        const createdProduct = await Product.findById(response.body.data._id);
        expect(createdProduct).not.toBeNull();
    });

    it("returns an error if the product data is invalid", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .post("/admin/create")
            .set("X-Authorization", token)
            .send({
                ...product,
                title: "",
                images: product.images.join(",")
            });

        expect(response.status).toBe(400);
    });
});

describe("POST /admin/changeInStock/:id", () => {
    it("updates the product stock successfully", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        const createdProduct = await createProduct();

        const response = await request(app)
            .post(`/admin/changeInStock/${createdProduct._id}`)
            .set("X-Authorization", token)
            .send({ changedStock: 5 });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("productCreated");

        const updatedProduct = await Product.findById(createdProduct._id);
        expect(updatedProduct.inStock).toBe(createdProduct.inStock + 5);
    });

    it("returns an error if the product ID is invalid", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .post("/admin/changeInStock/invalid-id")
            .set("X-Authorization", token)
            .send({ changedStock: 5 });

        expect(response.status).toBe(400);
    });
});

describe("DELETE /admin/delete/:id", () => {
    it("deletes a product successfully", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        const createdProduct = await createProduct();

        const response = await request(app)
            .delete(`/admin/delete/${createdProduct._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("productDeleted");

        const deletedProduct = await Product.findById(createdProduct._id);
        expect(deletedProduct).toBeNull();
    });

    it("returns an error if the product ID is invalid", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .delete("/admin/delete/invalid-id")
            .set("X-Authorization", token);

        expect(response.status).toBe(400);
    });
});

describe("PUT /admin/change/:id", () => {
    it("updates a product successfully", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        const createdProduct = await createProduct();

        const response = await request(app)
            .put(`/admin/change/${createdProduct._id}`)
            .set("X-Authorization", token)
            .send({
                ...product,
                title: "Updated Test Product",
                images: product.images.join(",")
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("productUpdated");
        expect(response.body.data.title).toBe("Updated Test Product");

        const updatedProduct = await Product.findById(createdProduct._id);
        expect(updatedProduct.title).toBe("Updated Test Product");
    });

    it("returns an error if the product data is invalid", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        const createdProduct = await createProduct();

        const response = await request(app)
            .put(`/admin/change/${createdProduct._id}`)
            .set("X-Authorization", token)
            .send({
                ...product,
                title: "",
                images: product.images.join(",")
            });

        expect(response.status).toBe(400);
    });
});

describe("GET /admin/complete/:id", () => {
    it("marks an order as completed", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        const registeredUser = await User.findOne({ email: user.email });
        const createdProduct = await createProduct();
        const createdOrder = await createOrder(registeredUser._id, createdProduct._id);

        const response = await request(app)
            .get(`/admin/complete/${createdOrder._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Order Completed.");

        const updatedOrder = await Order.findById(createdOrder._id);
        expect(updatedOrder.isCompleted).toBe(true);
    });

    it("returns an error if the order ID is invalid", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .get("/admin/complete/invalid-id")
            .set("X-Authorization", token);

        expect(response.status).toBe(400);
    });
});

describe("GET /admin/orders/all", () => {
    it("returns all orders", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        const registeredUser = await User.findOne({ email: user.email });
        const createdProduct = await createProduct();

        await createOrder(registeredUser._id, createdProduct._id);

        const response = await request(app)
            .get("/admin/orders/all")
            .set("X-Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].orderData[0].product.title).toBe(createdProduct.title);
    });

    it("returns an empty array if there are no orders", async () => {
        const registerResponse = await registerAdmin();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .get("/admin/orders/all")
            .set("X-Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(0);
    });
});