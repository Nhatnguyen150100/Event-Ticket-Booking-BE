"use strict";
import db from "../models";
import * as queryString from "qs";
import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseReponse";
import logger from "../config/winston";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import generateSignature from "../utils/generate-signature";

function sortObject(obj) {
  const sorted = {};
  const str = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }

  str.sort();
  for (const key of str) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }

  return sorted;
}

const paymentService = {
  createPayment: (userId, amount) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db.User.findOne({
          where: { id: userId },
        });
        const secretToken = bcrypt.hash(process.env.VN_PAY_HASH_KEY, 10);
        const merchantId = process.env.VN_PAY_MERCHANT_ID;
        const hashSecret = process.env.VN_PAY_HASH_SECRET;
        const vnPayUrl = process.env.VN_PAY_URL;
        const date = new Date();
        const createDate = dayjs(date).format("YYYYMMDDHHmmss");

        const vnpParams = {
          vnp_Version: "2.1.0",
          vnp_Command: "pay",
          vnp_TmnCode: merchantId,
          vnp_Amount: amount * 100,
          vnp_CreateDate: createDate,
          vnp_CurrCode: "VND",
          vnp_IpAddr: "127.0.0.1",
          vnp_Locale: "vn",
          vnp_OrderInfo: user.id,
          vnp_OrderType: "billpayment",
          vnp_ReturnUrl: `${process.env.BASE_URL_SERVER}/v1/payment/update-user-amount?secretToken=${secretToken}`,
          vnp_TxnRef: dayjs(date).format("DDHHmmss"),
        };

        const sortedKeys = sortObject(vnpParams);
        let signData = queryString.stringify(sortedKeys, { encode: false });
        const signature = generateSignature(signData, hashSecret);
        const paymentUrl = `${vnPayUrl}?${queryString.stringify(sortedKeys, {
          encode: false,
        })}&vnp_SecureHash=${signature}`;

        return resolve(
          new BaseSuccessResponse({
            data: paymentUrl,
            message: "Tạo thông tin thanh toán thành công",
          })
        );
      } catch (error) {
        logger.error(error.message);
        return reject(
          new BaseErrorResponse({
            message: error.message,
          })
        );
      }
    });
  }
};

export default paymentService;
