"use strict";

import imagesRouter from "./images";
import ticketRouters from "./ticketRouters";

const prefixURL = "/api/tickets";

const setUpRouters = (app) => {
  app.use(`${prefixURL}/images`, imagesRouter);
  app.use(prefixURL, ticketRouters)
}

export default setUpRouters;