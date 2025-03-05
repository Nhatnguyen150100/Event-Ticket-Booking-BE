"use strict";
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
import { join } from "path";

const dotenv = require("dotenv");
dotenv.config();

import connectDB from "./config/database.js";
import morgan from "morgan";
import setUpRouters from "./routes/index.js";
import rabbitMQListener from "./handler/rabbitMQListener.js";
import workers from "./workers/workers.js";

const logger = require("./config/winston.js");

dotenv.config();

connectDB();
rabbitMQListener();
const app = express();

workers();

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

app.use(bodyParser.json({ limit: "50mb" }));

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  legacyHeaders: true,
  message: "Too many requests from this IP, please try again in 5 minutes",
});
app.use(limiter);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "..", "public")));
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

/**
 * @toto router setup
 */
setUpRouters(app);

app.listen(process.env.PORT || 3000, () => {
  logger.info("Server listening on port: " + (process.env.PORT || 3000));
});

export default app;
