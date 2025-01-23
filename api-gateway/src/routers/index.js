"use strict";
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
const logger = require("../config/winston");
dotenv.config();

const PREFIX_URL = "/v1";

const buildPathName = (name) => {
  return `${PREFIX_URL}/${name}`;
};

const DEFINE_ROUTERS = [
  {
    pathName: buildPathName("auth"),
    target: process.env.AUTH_SERVICE_URL,
    pathRewrite: {
      "^/": "/api/auth/",
    },
  },
  {
    pathName: buildPathName("events"),
    target: process.env.EVENT_SERVICE_URL,
    pathRewrite: {
      "^/": "/api/events/",
    },
  },
  {
    pathName: buildPathName("tickets"),
    target: process.env.TICKET_SERVICE_URL,
    pathRewrite: {
      "^/": "/api/tickets/",
    },
  },
  {
    pathName: buildPathName("events-static"),
    target: process.env.EVENT_SERVICE_URL,
    pathRewrite: {
      "^/": "/",
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
        secure: true,
        changeOrigin: true,
        pathRewrite: router.pathRewrite,
        onError: (err, req, res) => {
          logger.error("Proxy error: ", err);
          res.status(500).send("Something went wrong with the proxy.");
        },
      }),
    );
    logger.info(
      `Setting up router ${router.pathName} to ${router.target}${router.pathRewrite["^/"]}`,
    );
  });
};

module.exports = setUpRouters;
