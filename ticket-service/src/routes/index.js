"use strict";

import eventRouters from "./eventRouters";
import imagesRouter from "./images";

const prefixURL = "/api/events";

const setUpRouters = (app) => {
  app.use(`${prefixURL}/images`, imagesRouter);
  app.use(prefixURL, eventRouters)
}

export default setUpRouters;