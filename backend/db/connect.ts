import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async (url:string) => {
  try {
    await mongoose.connect(url);
    console.log(`MongoDB connected`);
  } catch (error) {
    console.error(error);
  }
}

export default connectDB;