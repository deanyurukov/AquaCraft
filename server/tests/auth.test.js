import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";

const user = {
    username: "Test User",
    email: "test@example.com",
    password: "password123"
};

describe("POST /users/register", () => {
    it("creates a user and returns a token", async () => {
        const response = await request(app)
            .post("/users/register")
            .send(user);

        expect(response.status).toBe(201);
        expect(response.body.accessToken).toBeTruthy();
        expect(response.body.data.password).toBeUndefined();
    });

    it("throws an error if one of the fields is empty", async () => {
        const emptyUsername = await request(app)
            .post("/users/register")
            .send({ ...user, username: "" });

        const emptyEmail = await request(app)
            .post("/users/register")
            .send({ ...user, email: "" });

        const emptyPassword = await request(app)
            .post("/users/register")
            .send({ ...user, password: "" });

        expect(emptyUsername.status).toBe(400);
        expect(emptyEmail.status).toBe(400);
        expect(emptyPassword.status).toBe(400);
    });

    it("throws an error if the email already exists", async () => {
        const response = await request(app)
            .post("/users/register")
            .send(user);

        const errorResponse = await request(app)
            .post("/users/register")
            .send(user);

        expect(response.status).toBe(201);
        expect(errorResponse.status).toBe(409);
    });
});

describe("POST /users/login", () => {
    it("logs user and returns a token", async () => {
        const createResponse = await request(app)
            .post("/users/register")
            .send(user);

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email: user.email,
                password: user.password
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.accessToken).toBeTruthy();
        expect(loginResponse.body.data.password).toBeUndefined();
    });

    it("throws an error if one of the fields is empty", async () => {
        const emptyEmail = await request(app)
            .post("/users/login")
            .send({
                email: "",
                password: user.password
            });

        const emptyPassword = await request(app)
            .post("/users/login")
            .send({
                email: user.email,
                password: ""
            });

        expect(emptyEmail.status).toBe(400);
        expect(emptyPassword.status).toBe(400);
    });

    it("throws an error if the email does not exist", async () => {
        const response = await request(app)
            .post("/users/login")
            .send({
                email: user.email,
                password: user.password
            });

        expect(response.status).toBe(404);
    });

    it("throws an error if password is incorrect", async () => {
        const createResponse = await request(app)
            .post("/users/register")
            .send(user);

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email: user.email,
                password: "1234"
            });

        expect(loginResponse.status).toBe(401);
    });
});