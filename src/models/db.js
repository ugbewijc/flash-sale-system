import mongoose from "mongoose";
import { appConfig } from "../config.js";

mongoose.connect(appConfig.MONGO_URI);

export function connectToDB() {
    const db = mongoose.connection;
    db.on('error', (err) => {
        throw new Error('Unable to connect to MongoDB',err)
    });
    db.once('open', () => {
        // eslint-disable-next-line no-console
        console.log('Connected to MongoDB');
    });
}