import { default as mongoose } from "mongoose"
import logger from "./winston";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB connection is established');
  } catch (err) {
    logger.error('MongoDB connection is failed:', err);
    process.exit(1);
  }
};

export default connectDB;