import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { getErrorMessage } from "../utils/error-util.js";
import { isUserValid } from "../utils/auth-util.js";
import { secret } from "../config.js";

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send({ message: 'allFields' });
    }

    const userExists = await User.countDocuments({ email: email.trim() });

    if (userExists !== 0) {
        return res.status(409).send({ message: 'email.exists' });
    }

    const user = {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        isAdmin: false,
    };

    try {
        await User.create(user);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send({ message: getErrorMessage(err) });
    }

    const token = jwt.sign(user, secret);

    return res.status(201).send({ message: 'registerSuccess', accessToken: token });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(409).send({ message: 'allFields' });
    }

    const user = await User.findOne({ email: email.trim() });

    if (!user) {
        return res.status(404).send({ message: 'email.noProfile' });
    }

    const passwordsAreSame = await bcrypt.compare(password.trim(), user.password);

    if (!passwordsAreSame) {
        return res.status(401).send({ message: 'password.wrong' });
    }

    const userData = {
        email: user.email,
        username: user.username,
        password: user.password,
        isAdmin: user.isAdmin,
    }

    const token = jwt.sign(userData, secret);

    return res.status(200).send({ message: 'loginSuccess', accessToken: token });
});

router.get("/logout", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid) {
        const user = await User.findOne({ email: data.email });

        return res.status(200).send({ message: "logoutSuccess", data: user });
    }
    else {
        return res.status(401).send({ message });
    }
});

router.get('/getAuth', async (req, res) => {
    const [isValid, message] = await isUserValid(req.headers["x-authorization"]);
    return res.status(200).send({ isValid, message });
});

router.get('/userData', async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);
    delete data.password;
    return res.status(200).send({ data });
});

router.put("/changeUserData", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);
    const { email: newEmail, username: newUsername, password } = req.body;

    if (isValid) {
        const user = await User.findOne({ email: data.email });

        if (newEmail === user.email && newUsername === user.username) {
            return res.status(400).send({ message: "changeData" });
        }

        const usersWithThisEmail = await User.countDocuments({ email: newEmail });

        if (usersWithThisEmail > 0 && newEmail !== data.email) {
            return res.status(409).send({ message: "email.exists" });
        }

        const isPasswordSame = await bcrypt.compare(password, user.password);

        if (!isPasswordSame) {
            return res.status(403).send({ message: "password.wrong" });
        }

        user.email = newEmail;
        user.username = newUsername;

        const userToken = {
            username: newUsername.trim(),
            email: newEmail.trim(),
            password: password.trim(),
            isAdmin: user.isAdmin,
        };

        const token = jwt.sign(userToken, secret);

        try {
            await user.save();
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }

        return res.status(200).send({ message: "dataChangeSuccess", accessToken: token });
    }
    else {
        return res.status(401).send({ message });
    }
});

router.put("/changeUserPassword", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);
    const { password, new_password } = req.body;

    if (isValid) {
        const user = await User.findOne({ email: data.email });

        const isPasswordSame = await bcrypt.compare(password, user.password);

        if (!isPasswordSame) {
            return res.status(403).send({ message: "password.wrong" });
        }

        user.password = new_password;

        const userToken = {
            username: user.username,
            email: user.email,
            password: new_password.trim(),
            isAdmin: user.isAdmin,
        };

        const token = jwt.sign(userToken, secret);

        try {
            await user.save();
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }

        return res.status(200).send({ message: "passwordChangeSuccess", accessToken: token });
    }
    else {
        return res.status(401).send({ message });
    }
});

export default router;