import mongoose from "mongoose";
import colors from "colors";

const connect = async () => {
    mongoose.set("strictQuery", true);
    const dbUri = process.env.MONGO_URI ?? '';
    try {
        const conn = await mongoose.connect(dbUri);
        console.log(colors.cyan.underline(`MongoDB Connected: ${conn.connection.host}`));
    } catch (error: any) {
        console.log(colors.red.bold(`Error: ${error.message}`));
        process.exit(1);
    }
}

export default connect;
