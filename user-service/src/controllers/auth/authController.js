"use strict";
import logger from "../../config/winston.js";
import authService from "../../services/auth/authService.js";
import tokenService from "../../services/token/tokenService.js";

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const rs = await authService.login(email, password);
      if (!rs.data) {
        return res.status(rs.status).json({ message: rs.message });
      }
      const accessToken = tokenService.generateToken(rs.data);
      res.status(rs.status).json({
        message: rs.message,
        data: { user: rs.data, accessToken: accessToken },
        status: rs.status,
      });
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      const rs = await authService.register(email, password);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
  me: async (req, res) => {
    try {
      const { id } = req.user;
      const rs = await authService.getUserById(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { id } = req.user;
      const result = await authService.updateProfile(id, req.body);
      res.status(result.status).json(result);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
};

export default authController;
