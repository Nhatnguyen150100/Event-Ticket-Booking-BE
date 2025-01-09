const { Schema, model } = require("mongoose");
const { hash, compare } = require("bcrypt");
const logger = require("../config/winston");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await compare(password, this.password);
};

const deleteMany = async () => {
  try {
    const result = await User.deleteMany({});
    logger.info(`Đã xóa ${result.deletedCount} người dùng.`);
    return result;
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    throw error;
  }
};

const insertMany = async (users) => {
  try {
    const result = await User.insertMany(users);
    logger.info(`Đã thêm ${result.length} người dùng.`);
    return result;
  } catch (error) {
    logger.error("Lỗi khi thêm người dùng:", error);
    throw error;
  }
};

const User = model("User", userSchema);

module.exports = { User, deleteMany, insertMany };