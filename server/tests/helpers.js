import request from "supertest";
import { expect } from "vitest";
import app from "../src/app";
import { product, user } from "./test-data";
import Product from "../src/models/Product";

export async function registerSuccessfulUser() {
    return await request(app)
        .post("/users/register")
        .send(user);
}

export async function expectUnauthorized(method, endpoint) {
    const response = await request(app)[method](endpoint)
        .set("X-Authorization", "wrong-token");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("authNeeded");
}

export async function createProduct(overrides = {}) {
    return await Product.create({
        ...product,
        ...overrides
    });
}