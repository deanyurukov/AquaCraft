import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";

describe("POST /users/register", () => {
    it("creates a user and returns a token", async () => {
        const response = await request(app)
            .post("/users/register")
            .send({
                username: "Test User",
                email: "test@example.com",
                password: "password123"
            });

        expect(response.status).toBe(201);
        expect(response.body.accessToken).toBeTruthy();
        expect(response.body.data.password).toBeUndefined();
    });

    it("throws an error if one of the fields is empty", async () => {
        const emptyUsername = await request(app)
            .post("/users/register")
            .send({
                username: "",
                email: "test@example.com",
                password: "password123"
            });

        const emptyEmail = await request(app)
            .post("/users/register")
            .send({
                username: "Test User",
                email: "",
                password: "password123"
            });

        const emptyPassword = await request(app)
            .post("/users/register")
            .send({
                username: "Test User",
                email: "test@example.com",
                password: ""
            });

        expect(emptyUsername.status).toBe(400);
        expect(emptyEmail.status).toBe(400);
        expect(emptyPassword.status).toBe(400);
    });

    it("throws an error if the email already exists", async () => {
        const response = await request(app)
            .post("/users/register")
            .send({
                username: "Test User",
                email: "test@example.com",
                password: "password123"
            });

        const errorResponse = await request(app)
            .post("/users/register")
            .send({
                username: "Test User",
                email: "test@example.com",
                password: "password123"
            });

        expect(response.status).toBe(201);
        expect(errorResponse.status).toBe(409);
    });
});