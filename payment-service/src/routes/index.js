"use strict";

import imagesRouter from "./images";
import paymentRouters from "./paymentRouters";

const prefixURL = "/api/payments";

const setUpRouters = (app) => {
  app.use(`${prefixURL}/images`, imagesRouter);
  app.use(prefixURL, paymentRouters)
}

export default setUpRouters;