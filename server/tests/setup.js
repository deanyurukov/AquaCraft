import mongoose from "mongoose";
import { afterAll, afterEach, beforeAll } from "vitest";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import User from "../src/models/User.js";
import Product from "../src/models/Product.js";
import Order from "../src/models/Order.js";

let mongoServer;

process.env.JWT_SECRET = "test-secret";

beforeAll(async () => {
    mongoServer = await MongoMemoryReplSet.create({
        replSet: { count: 1 }
    });

    await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});