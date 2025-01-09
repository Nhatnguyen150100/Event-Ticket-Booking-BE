"use strict";
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();

import morgan from "morgan";
import setUpRouters from "./routers/index.js";

const logger = require("./config/winston.js");

const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL_CLIENT,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    exposedHeaders: ["X-Total-Count", "token"],
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  legacyHeaders: true,
  message: "Too many requests from this IP, please try again in 5 minutes",
});
app.use(limiter);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

/**
 * @toto proxy middleware setup
 */
setUpRouters(app);


app.listen(process.env.PORT || 3000, () => {
  logger.info("API Gateway listening on port: " + (process.env.PORT || 3000));
});

export default app;
