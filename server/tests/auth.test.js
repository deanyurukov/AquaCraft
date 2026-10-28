import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";
import { expectUnauthorized, registerSuccessfulUser } from "./helpers.js";
import { user } from "./test-data.js";

describe("POST /users/register", () => {
    it("creates a user and returns a token", async () => {
        const response = await registerSuccessfulUser();

        expect(response.status).toBe(201);
        expect(response.body.accessToken).toBeTruthy();
        expect(response.body.data.password).toBeUndefined();
    });

    it("returns an error if one of the fields is empty", async () => {
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

    it("returns an error if the email already exists", async () => {
        await registerSuccessfulUser();

        const errorResponse = await request(app)
            .post("/users/register")
            .send(user);

        expect(errorResponse.status).toBe(409);
    });
});

describe("POST /users/login", () => {
    it("logs user and returns a token", async () => {
        await registerSuccessfulUser();

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

    it("returns an error if one of the fields is empty", async () => {
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

    it("returns an error if the email does not exist", async () => {
        const response = await request(app)
            .post("/users/login")
            .send({
                email: user.email,
                password: user.password
            });

        expect(response.status).toBe(404);
    });

    it("returns an error if password is incorrect", async () => {
        await registerSuccessfulUser();

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email: user.email,
                password: "1234"
            });

        expect(loginResponse.status).toBe(401);
    });
});

describe("GET /users/logout", () => {
    it("logs out a user correctly", async () => {
        const createResponse = await registerSuccessfulUser();
        const accessToken = createResponse.body.accessToken;

        const logoutResponse = await request(app)
            .get("/users/logout")
            .set("X-Authorization", accessToken);

        expect(logoutResponse.status).toBe(200);
        expect(logoutResponse.body.data).toBeTruthy();
    });

    it("returns an error when access token is incorrect", async () => {
        await expectUnauthorized("get", "/users/logout");
    });
})