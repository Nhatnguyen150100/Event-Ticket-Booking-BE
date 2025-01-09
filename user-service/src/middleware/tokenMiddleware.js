"use strict";
import tokenService from "../services/token/tokenService.js";

const tokenMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }
    const accessToken = token.split(" ")[1];
    const user = tokenService.verifyToken(accessToken);
    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  },
  verifyTokenAdmin: (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }
    const accessToken = token.split(" ")[1];
    const user = tokenService.verifyToken(accessToken);
    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }
    if (user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Unauthorized access for user (only admin)" });
    }
    req.user = user;
    next();
  },
};

export default tokenMiddleware;
