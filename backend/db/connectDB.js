import mongoose from "mongoose";
import colors from 'colors'; 

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.blue.underline); 
  } catch (error) {
    console.error("MongoDB connection failed".red); 
    process.exit(1);
  }
};

export default connectDB;