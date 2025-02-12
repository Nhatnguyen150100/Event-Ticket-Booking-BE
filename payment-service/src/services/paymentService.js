"use strict";
import * as queryString from "qs";
import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseResponse";
import logger from "../config/winston";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import generateSignature from "../utils/generate-signature";
import rabbitMQHandler from "../handler/rabbitMQHandler";

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
  createPayment: (id, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { ticketId, quantity } = data;
        const ticketDetail = await rabbitMQHandler.getTicketFromTicketId(
          ticketId,
        );
        if(quantity > (ticketDetail?.data.quantity - ticketDetail?.data.soldQuantity)) {
          return reject(new BaseErrorResponse({ message: "Not enough quantity" }));
        }
        const amount = ticketDetail?.data.price * quantity * 100;
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
          vnp_Amount: amount,
          vnp_CreateDate: createDate,
          vnp_CurrCode: "VND",
          vnp_IpAddr: "127.0.0.1",
          vnp_Locale: "vn",
          vnp_OrderInfo: id,
          vnp_OrderType: "billpayment",
          vnp_ReturnUrl: `${process.env.BASE_URL_SERVER}/v1/payments/create-booking?secretToken=${secretToken}&ticketId=${ticketId}&quantity=${quantity}`,
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
          }),
        );
      } catch (error) {
        logger.error(error.message);
        return reject(
          new BaseErrorResponse({
            message: error.message,
          }),
        );
      }
    });
  },
  createBooking: (userId, ticketId, quantity, secretToken) => {
    return new Promise(async (resolve, reject) => {
      try {
        const validHashKey = bcrypt.compare(
          secretToken,
          process.env.VN_PAY_HASH_KEY
        );
        if (!validHashKey) {
          return reject(
            new BaseErrorResponse({
              message: "Mã xác thực không chính xác",
            })
          );
        }
        const booking = await rabbitMQHandler.createBooking({
          userId,
          ticketId,
          quantity,
        })
        return resolve(
          new BaseSuccessResponse({
            data: booking,
            message: "Cập nhật tài khoản người dùng thành công",
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
  },
};

export default paymentService;
