//connection file
import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`mongodb connected:${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`error message:${error.message}`.red.underline.bold);
    process.exit(1);
  }
};
export default connectDB;
