import jwt from "jsonwebtoken";
import { secret } from "../api/index.js";

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