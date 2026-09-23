import jwt from "jsonwebtoken";
import { secret } from "../config.js";

export async function isUserValid(accessToken) {
    let data = {};
    let isValid = true;
    let message = "Successful authentication.";

    try {
        data = jwt.verify(accessToken, secret);
    }
    catch (err) {
        isValid = false;
        message = "authNeeded";
    }

    return [isValid, message, data];
}