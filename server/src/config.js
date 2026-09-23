import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const secret = process.env.JWT_SECRET;
export const port = process.env.PORT;
export const allowedOrigins = [process.env.DEPLOYED_CLIENT_PATH, "http://localhost:3000", "http://192.168.1.6:3000"];


const uri = process.env.LOCAL_DB_URI_KEY || process.env.DEPLOYED_DB_URI_KEY;

try {
    await mongoose.connect(uri);
    console.log('Connected to DB Successfully.');
} catch (err) {
    console.error('Cannot connect to DB!');
    console.log(err.message);
}