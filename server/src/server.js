import express from 'express';

import "./config.js";
import { port } from './config.js';

import configRoutes from "./routes/config-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import userRoutes from "./routes/user-routes.js";
import productRoutes from "./routes/product-routes.js";
import orderRoutes from "./routes/order-routes.js";

const app = express();

app.use(configRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.all("*", function (req, res) {
    return res.status(404).send({ message: "Route not found." });
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}...`));