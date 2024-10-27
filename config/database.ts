import mongoose from "mongoose";

const dbConnection = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI as string, {
      autoIndex: true,
    });
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error}`);
    process.exit(1); // Exit process with failure
  }
};

export default dbConnection;
