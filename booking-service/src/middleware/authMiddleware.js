"use strict";
import authService from "../services/auth/authService.js";

const authMiddleware = {
  checkUserExist: async (req, res, next) => {
    try {
      const { email } = req.body;
      const { data, message } = await authService.checkUserExists(email);
      if (data) {
        return res.status(400).json({ message });
      }
      next();
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
};

export default authMiddleware;
