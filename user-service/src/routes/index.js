"use strict";

import authRouter from "./authRouter";

const prefixURL = "/api/auth";

const setUpRouters = (app) => {
  app.use(`${prefixURL}/images`, authRouter);
  app.use(prefixURL, authRouter);
}

export default setUpRouters;