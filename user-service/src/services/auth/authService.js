"use strict";
import logger from "../../config/winston.js";
import {
  BaseErrorResponse,
  BaseSuccessResponse,
} from "../../config/baseResponse.js";
import generateRandomPassword from "../../utils/generate-password.js";
import { User } from "../../models/user.js";

const authService = {
  login: (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return resolve(
            new BaseErrorResponse({
              message: "Account not found. Please try again",
            }),
          );
        }
        const validPassword = await user.isValidPassword(password);
        if (!validPassword) {
          return resolve(
            new BaseErrorResponse({
              message: "Password is not valid. Please try again",
            }),
          );
        } else {
          delete user._doc.password;
          return resolve(
            new BaseSuccessResponse({
              data: user._doc,
              message: "Login successfully",
            }),
          );
        }
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
  loginByGoogle: (email, name) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          const randomPassword = generateRandomPassword(8);
          const newUser = new User({ email, password: randomPassword, name });
          await newUser.save();
          const rs = newUser.toObject();
          delete rs.password;
          return resolve(
            new BaseSuccessResponse({
              data: rs,
              message: "Đăng nhập thành công",
            }),
          );
        }
        delete user._doc.password;
        return resolve(
          new BaseSuccessResponse({
            data: user._doc,
            message: "Đăng nhập thành công",
          }),
        );
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
  register: (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = new User({ email, password });
        await user.save();
        const rs = user.toObject();
        delete rs.password;
        return resolve(
          new BaseSuccessResponse({
            data: rs,
            message: "Registration successfully",
          }),
        );
      } catch (error) {
        logger.error(error.parent);
        reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
  checkUserExists: (email) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ email });
        if (user) {
          return resolve(
            new BaseSuccessResponse({
              data: true,
              message: "Email is already exists",
            }),
          );
        } else {
          return resolve(
            new BaseSuccessResponse({
              data: false,
              message: "Email is not available",
            }),
          );
        }
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
};

export default authService;
