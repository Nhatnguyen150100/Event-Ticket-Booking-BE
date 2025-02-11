"use strict";

import imagesRouter from "./images";

const prefixURL = "/api/payment";

const setUpRouters = (app) => {
  app.use(`${prefixURL}/images`, imagesRouter);
  app.use(prefixURL, paymentRouters)
}

export default setUpRouters;