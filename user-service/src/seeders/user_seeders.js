const mongoose = require("mongoose");
const { deleteMany, insertMany } = require("../models/user");
const dotenv = require("dotenv");
const logger = require("../config/winston");
dotenv.config();

const { connect, connection } = mongoose;

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Kết nối đến MongoDB thành công");
  } catch (error) {
    logger.error("Lỗi kết nối MongoDB:", error);
    process.exit(1);
  }
};

const users = [
  {
    email: "user1@gmail.com",
    name: "Nguyen Van A",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    address: "Hanoi",
  },
  {
    email: "admin@gmail.com",
    name: "Admin",
    role: "ADMIN",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0987654321",
    address: "Hanoi",
  },
];

const seedUsers = async () => {
  await connectDB();

  await deleteMany();

  await insertMany(users);
  logger.info("Dữ liệu người dùng đã được chèn thành công!");

  connection.close();
};

module.exports = seedUsers;