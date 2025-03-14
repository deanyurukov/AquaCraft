import jwt from "jsonwebtoken";
import { secret } from "../server.js";

export async function isUserValid(accessToken) {
    let data = {};
    let isValid = true;
    let message = "Усшешна ауторизация.";

    try {
        data = jwt.verify(accessToken, secret);
    }
    catch (err) {
        isValid = false;
        message = "authNeeded";
    }

    return [isValid, message, data];
}