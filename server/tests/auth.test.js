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

describe("GET /users/userData", () => {
    it("returns user data correctly", async () => {
        const createResponse = await registerSuccessfulUser();
        const accessToken = createResponse.body.accessToken;

        const response = await request(app)
            .get("/users/userData")
            .set("X-Authorization", accessToken);

        expect(response.status).toBe(200);
        expect(response.body.isValid).toBe(true);
        expect(response.body.data.username).toBe(user.username);
        expect(response.body.data.email).toBe(user.email);
        expect(response.body.data.password).toBeUndefined();
    });

    it("returns an error when access token is incorrect", async () => {
        await expectUnauthorized("get", "/users/userData");
    });
});

describe("PUT /users/changeUserData", () => {
    it("changes user data and returns a new token", async () => {
        const createResponse = await registerSuccessfulUser();
        const accessToken = createResponse.body.accessToken;

        const response = await request(app)
            .put("/users/changeUserData")
            .set("X-Authorization", accessToken)
            .send({
                email: "updated@example.com",
                username: "Updated User",
                password: user.password
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("dataChangeSuccess");
        expect(response.body.accessToken).toBeTruthy();

        const userDataResponse = await request(app)
            .get("/users/userData")
            .set("X-Authorization", response.body.accessToken);

        expect(userDataResponse.status).toBe(200);
        expect(userDataResponse.body.data.email).toBe("updated@example.com");
        expect(userDataResponse.body.data.username).toBe("Updated User");
    });

    it("returns an error if no changes were made", async () => {
        const createResponse = await registerSuccessfulUser();
        const accessToken = createResponse.body.accessToken;

        const response = await request(app)
            .put("/users/changeUserData")
            .set("X-Authorization", accessToken)
            .send({
                email: user.email,
                username: user.username,
                password: user.password
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("changeData");
    });

    it("returns an error if the email already exists", async () => {
        const createResponse = await registerSuccessfulUser();
        const accessToken = createResponse.body.accessToken;

        await request(app)
            .post("/users/register")
            .send({
                ...user,
                email: "existing@example.com"
            });

        const response = await request(app)
            .put("/users/changeUserData")
            .set("X-Authorization", accessToken)
            .send({
                email: "existing@example.com",
                username: "Updated User",
                password: user.password
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("email.exists");
    });

    it("returns an error if password is incorrect", async () => {
        const createResponse = await registerSuccessfulUser();
        const accessToken = createResponse.body.accessToken;

        const response = await request(app)
            .put("/users/changeUserData")
            .set("X-Authorization", accessToken)
            .send({
                email: "updated@example.com",
                username: "Updated User",
                password: "wrongPassword"
            });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("password.wrong");
    });

    it("returns an error when access token is incorrect", async () => {
        await expectUnauthorized("put", "/users/changeUserData");
    });
});

describe("PUT /users/changeUserPassword", () => {
    it("changes user password and returns a new token", async () => {
        const createResponse = await registerSuccessfulUser();
        const accessToken = createResponse.body.accessToken;

        const response = await request(app)
            .put("/users/changeUserPassword")
            .set("X-Authorization", accessToken)
            .send({
                password: user.password,
                new_password: "newPassword123"
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("passwordChangeSuccess");
        expect(response.body.accessToken).toBeTruthy();

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email: user.email,
                password: "newPassword123"
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.accessToken).toBeTruthy();
    });

    it("returns an error if password is incorrect", async () => {
        const createResponse = await registerSuccessfulUser();
        const accessToken = createResponse.body.accessToken;

        const response = await request(app)
            .put("/users/changeUserPassword")
            .set("X-Authorization", accessToken)
            .send({
                password: "wrongPassword",
                new_password: "newPassword123"
            });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("password.wrong");
    });

    it("returns an error when access token is incorrect", async () => {
        await expectUnauthorized("put", "/users/changeUserPassword");
    });
});