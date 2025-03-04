import mongoose from "mongoose";
import { appConfig } from "../config.js";

mongoose.connect(appConfig.MONGO_URI);

export function connectToDB() {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
}


// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// export default mongoose;

