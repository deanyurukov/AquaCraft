import request from "supertest";
import { expect } from "vitest";
import app from "../src/app";
import { user } from "./test-data";

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