"use strict";

import bookingRouters from "./bookingRouters";
import imagesRouter from "./images";

const prefixURL = "/api/bookings";

const setUpRouters = (app) => {
  app.use(`${prefixURL}/images`, imagesRouter);
  app.use(prefixURL, bookingRouters)
}

export default setUpRouters;