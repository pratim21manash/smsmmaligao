import mongoose from "mongoose";
import Admin from "../models/Admin.js";

const seedDefaultAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const existingAdmin = await Admin.findOne({ email });
  if (!existingAdmin) {
    await Admin.create({
      email,
      password,
      name: "Super Admin",
    });
    console.log(`Default admin created: ${email}`);
  }
};

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured");
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDefaultAdmin();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
