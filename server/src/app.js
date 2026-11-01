import express from "express";
import configRoutes from "./routes/config-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import userRoutes from "./routes/user-routes.js";
import productRoutes from "./routes/product-routes.js";
import orderRoutes from "./routes/order-routes.js";

const app = express();

app.set("trust proxy", 1);

app.use(configRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.all("*", (req, res) => {
    return res.status(404).send({ message: "Route not found." });
});

export default app;