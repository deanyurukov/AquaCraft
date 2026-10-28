import app from "./app.js";
import { connectDb, port } from "./config.js";

await connectDb();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}...`);
});