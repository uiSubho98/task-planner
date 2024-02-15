import mongoose from "mongoose";

const bootstrap = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URI}TaskPlanner`);
    console.log(`DB is connected`);
    
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
};

export default bootstrap;
