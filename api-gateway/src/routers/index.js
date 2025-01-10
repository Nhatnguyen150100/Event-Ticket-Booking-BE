"use strict";
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
const logger = require("../config/winston");
dotenv.config();

const DEFINE_ROUTERS = [
  {
    pathName: "/auth",
    target: process.env.AUTH_SERVICE_URL,
    pathRewrite: {
      "^/": "/api/auth/",
    },
  },
  {
    pathName: "/events",
    target: process.env.EVENT_SERVICE_URL,
    pathRewrite: {
      "^/": "/api/events/",
    },
  },
];

const setUpRouters = (app) => {
  DEFINE_ROUTERS.forEach((router) => {
    if (!router.target) {
      logger.error(`Target URL for ${router.pathName} is not defined.`);
      return;
    }

    app.use(
      router.pathName,
      createProxyMiddleware({
        target: router.target,
        changeOrigin: true,
        pathRewrite: router.pathRewrite,
        onError: (err, req, res) => {
          logger.error("Proxy error: ", err);
          res.status(500).send("Something went wrong with the proxy.");
        },
      }),
    );
    logger.info(`Setting up router ${router.pathName} to ${router.target}${router.pathRewrite['^/']}`);
  });
};

module.exports = setUpRouters;
