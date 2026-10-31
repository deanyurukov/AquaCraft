import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";
import Product from "../src/models/Product";
import {
    expectUnauthorized,
    registerSuccessfulUser,
    createProduct
} from "./helpers";

describe("GET /products/get/all", () => {
    it("returns all products", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const product1 = await createProduct();
        const product2 = await createProduct({
            title: "Another Test Product"
        });

        const response = await request(app)
            .get("/products/get/all")
            .set("X-Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(2);

        const productIds = response.body.data.map(product => product._id);

        expect(productIds).toContain(product1._id.toString());
        expect(productIds).toContain(product2._id.toString());
    });

    it("returns an empty array if there are no products", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .get("/products/get/all")
            .set("X-Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([]);
    });

    it("marks the user's favorite products", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const favoriteProduct = await createProduct();
        const regularProduct = await createProduct({
            title: "Regular Product"
        });

        await request(app)
            .post(`/products/favorites/add/${favoriteProduct._id}`)
            .set("X-Authorization", token);

        const response = await request(app)
            .get("/products/get/all")
            .set("X-Authorization", token);

        expect(response.status).toBe(200);

        const favorite = response.body.data.find(
            product => product._id === favoriteProduct._id.toString()
        );

        const regular = response.body.data.find(
            product => product._id === regularProduct._id.toString()
        );

        expect(favorite.isFav).toBe(true);
        expect(regular.isFav).toBeUndefined();
    });
});

describe("POST /products/cart/add/:id", () => {
    it("adds a product to the user's cart", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        const response = await request(app)
            .post(`/products/cart/add/${product._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Product added successfully.");

        const cartResponse = await request(app)
            .get("/products/cart/get")
            .set("X-Authorization", token);

        expect(cartResponse.status).toBe(200);
        expect(cartResponse.body.data).toHaveLength(1);
        expect(cartResponse.body.data[0].product._id).toBe(product._id.toString());
    });

    it("returns an error if the product is already in the cart", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        await request(app)
            .post(`/products/cart/add/${product._id}`)
            .set("X-Authorization", token);

        const response = await request(app)
            .post(`/products/cart/add/${product._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("productInCart");
    });

    it("returns an error if the access token is invalid", async () => {
        const product = await createProduct();

        await expectUnauthorized("post", `/products/cart/add/${product._id}`);
    });
});

describe("GET /products/cart/get", () => {
    it("returns the products in the user's cart", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const product1 = await createProduct();
        const product2 = await createProduct({
            title: "Another Test Product"
        });

        await request(app)
            .post(`/products/cart/add/${product1._id}`)
            .set("X-Authorization", token);

        await request(app)
            .post(`/products/cart/add/${product2._id}`)
            .set("X-Authorization", token);

        const response = await request(app)
            .get("/products/cart/get")
            .set("X-Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("There are products in cart.");
        expect(response.body.data).toHaveLength(2);

        const cartProductIds = response.body.data.map(
            item => item.product._id
        );

        expect(cartProductIds).toContain(product1._id.toString());
        expect(cartProductIds).toContain(product2._id.toString());
    });

    it("returns an empty cart if the user has no products", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .get("/products/cart/get")
            .set("X-Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([]);
    });

    it("returns an error if the access token is invalid", async () => {
        await expectUnauthorized("get", "/products/cart/get");
    });
});

describe("GET /products/:id", () => {
    it("returns a product by its ID", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        const response = await request(app)
            .get(`/products/${product._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Product found.");
        expect(response.body.data._id).toBe(product._id.toString());
        expect(response.body.data.title).toBe(product.title);
        expect(response.body.data.price).toBe(product.price);
    });

    it("returns an error if the product ID is invalid", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;

        const response = await request(app)
            .get("/products/invalid-id")
            .set("X-Authorization", token);

        expect(response.status).toBe(404);
        expect(response.text).toBe("Error retrieving product.");
    });

    it("returns null if the product does not exist", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        await Product.findByIdAndDelete(product._id);

        const response = await request(app)
            .get(`/products/${product._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body.data).toBeNull();
    });
});

describe("PUT /products/:id", () => {
    it("updates the quantity of a product in the cart", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        await request(app)
            .post(`/products/cart/add/${product._id}`)
            .set("X-Authorization", token);

        const response = await request(app)
            .put(`/products/${product._id}`)
            .set("X-Authorization", token)
            .send({ quantity: 5 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Quantity updated successfully.");

        const updatedProduct = response.body.products.find(
            item => item.product.toString() === product._id.toString()
        );

        expect(updatedProduct.quantity).toBe(5);
    });

    it("returns an error if the product is not in the user's cart", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        const response = await request(app)
            .put(`/products/${product._id}`)
            .set("X-Authorization", token)
            .send({ quantity: 2 });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Product is not in cart!");
    });

    it("returns an error if the quantity is zero", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        const response = await request(app)
            .put(`/products/${product._id}`)
            .set("X-Authorization", token)
            .send({ quantity: 0 });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid quantity.");
    });

    it("returns an error if the quantity is negative", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        const response = await request(app)
            .put(`/products/${product._id}`)
            .set("X-Authorization", token)
            .send({ quantity: -1 });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid quantity.");
    });

    it("returns an error if the quantity exceeds 999", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        const response = await request(app)
            .put(`/products/${product._id}`)
            .set("X-Authorization", token)
            .send({ quantity: 1000 });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid quantity.");
    });

    it("returns an error if the quantity is not an integer", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        const response = await request(app)
            .put(`/products/${product._id}`)
            .set("X-Authorization", token)
            .send({ quantity: 1.5 });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid quantity.");
    });

    it("returns an error if the quantity is missing", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        const response = await request(app)
            .put(`/products/${product._id}`)
            .set("X-Authorization", token)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid quantity.");
    });

    it("returns an error if the access token is invalid", async () => {
        const product = await createProduct();

        await expectUnauthorized("put", `/products/${product._id}`);
    });
});

describe("DELETE /products/:id", () => {
    it("removes a product from the user's cart", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        await request(app)
            .post(`/products/cart/add/${product._id}`)
            .set("X-Authorization", token);

        const response = await request(app)
            .delete(`/products/${product._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Product removed from card successfully.");

        const cartResponse = await request(app)
            .get("/products/cart/get")
            .set("X-Authorization", token);

        expect(cartResponse.body.data).toHaveLength(0);
    });

    it("returns an error if the product is not in the cart", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        const response = await request(app)
            .delete(`/products/${product._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Product is not in cart!");
    });

    it("returns an error if the access token is invalid", async () => {
        const product = await createProduct();

        await expectUnauthorized("delete", `/products/${product._id}`);
    });
});

describe("POST /products/favorites/add/:id", () => {
    it("adds a product to the user's favorites", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        const response = await request(app)
            .post(`/products/favorites/add/${product._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Product liked successfully.");

        const productsResponse = await request(app)
            .get("/products/get/all")
            .set("X-Authorization", token);

        const favorite = productsResponse.body.data.find(
            item => item._id === product._id.toString()
        );

        expect(favorite.isFav).toBe(true);
    });

    it("returns an error if the product is already in favorites", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        await request(app)
            .post(`/products/favorites/add/${product._id}`)
            .set("X-Authorization", token);

        const response = await request(app)
            .post(`/products/favorites/add/${product._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Product already liked!");
    });

    it("returns an error if the access token is invalid", async () => {
        const product = await createProduct();

        await expectUnauthorized("post", `/products/favorites/add/${product._id}`);
    });
});

describe("POST /products/favorites/remove/:id", () => {
    it("removes a product from the user's favorites", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        await request(app)
            .post(`/products/favorites/add/${product._id}`)
            .set("X-Authorization", token);

        const response = await request(app)
            .post(`/products/favorites/remove/${product._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Product removed from liked successfully.");

        const productsResponse = await request(app)
            .get("/products/get/all")
            .set("X-Authorization", token);

        const favorite = productsResponse.body.data.find(
            item => item._id === product._id.toString()
        );

        expect(favorite.isFav).toBeUndefined();
    });

    it("returns an error if the product is not in favorites", async () => {
        const registerResponse = await registerSuccessfulUser();
        const token = registerResponse.body.accessToken;
        const product = await createProduct();

        const response = await request(app)
            .post(`/products/favorites/remove/${product._id}`)
            .set("X-Authorization", token);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Product is not liked!");
    });

    it("returns an error if the access token is invalid", async () => {
        const product = await createProduct();

        await expectUnauthorized("post", `/products/favorites/remove/${product._id}`);
    });
});