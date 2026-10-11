import { isUserValid } from "../utils/auth-util.js";

export async function requireAdmin(req, res, next) {
    const [isValid, message, data] = await isUserValid(
        req.headers["x-authorization"]
    );

    if (!isValid) {
        return res.status(401).send({ message });
    }

    if (!data.isAdmin) {
        return res.status(403).send({ message: "Route is only available for an admin." });
    }

    req.user = data;

    next();
}