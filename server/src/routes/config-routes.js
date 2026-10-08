import express from "express";
import { allowedOrigins } from "../config.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

router.use(express.urlencoded({ extended: false, limit: "20kb" }));
router.use(express.json({ limit: "20kb" }));

router.use((req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin); // Dynamic Origin
        res.setHeader('Access-Control-Allow-Credentials', 'true'); // If sending cookies or auth headers
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Authorization');

    next();
});

router.options('*', (req, res) => {
    return res.status(204).send();
});

router.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        console.log(
            `${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`
        );
    });

    next();
});

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too Many Request"
    }
});

router.use(apiLimiter);

export default router;