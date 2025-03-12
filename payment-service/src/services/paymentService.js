"use strict";
import * as queryString from "qs";
import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseResponse";
import logger from "../config/winston";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import generateSignature from "../utils/generate-signature";
import rabbitMQHandler from "../handler/rabbitMQHandler";
import axios from "axios";

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
        const { ticketId, quantity, amount } = data;
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
  createBooking: (userId, ticketId, quantity, secretToken, amount) => {
    return new Promise(async (resolve, reject) => {
      try {
        const validHashKey = bcrypt.compare(
          secretToken,
          process.env.VN_PAY_HASH_KEY,
        );
        if (!validHashKey) {
          return reject(
            new BaseErrorResponse({
              message: "Mã xác thực không chính xác",
            }),
          );
        }
        const booking = await rabbitMQHandler.createBooking({
          userId,
          ticketId,
          quantity,
        });
        return resolve(
          new BaseSuccessResponse({
            data: booking,
            message: "Cập nhật tài khoản người dùng thành công",
          }),
        );
      } catch (error) {
        const res = await paymentService.refundPaymentCreateBookingErr({
          userId,
          amount,
        });
        logger.error(error.message);
        return reject(
          new BaseErrorResponse({
            message: res.message,
          }),
        );
      }
    });
  },
  refundPaymentCreateBookingErr: ({ userId, amount }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const merchantId = process.env.VN_PAY_MERCHANT_ID;
        const hashSecret = process.env.VN_PAY_HASH_SECRET;
        const vnPayRefundUrl = process.env.VN_PAY_REFUND_URL;
        const createDate = dayjs().format("YYYYMMDDHHmmss");
        const ipAddr = "127.0.0.1";

        const vnpParams = {
          vnp_RequestId: `REFUND${dayjs().format("HHmmssSSS")}`,
          vnp_Version: "2.1.0",
          vnp_Command: "refund",
          vnp_CreateBy: userId,
          vnp_TmnCode: merchantId,
          vnp_Amount: Math.round(amount * 100),
          vnp_TransactionDate: dayjs(new Date()).format("YYYYMMDDHHmmss"),
          vnp_CreateDate: createDate,
          vnp_IpAddr: ipAddr,
          vnp_OrderInfo: `Refund for booking`,
          vnp_TransactionType: "02",
        };

        const sortedParams = sortObject(vnpParams);
        const signData = queryString.stringify(sortedParams, { encode: false });
        const signature = generateSignature(signData, hashSecret);

        const response = await axios.post(
          vnPayRefundUrl,
          {
            ...sortedParams,
            vnp_SecureHash: signature,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );

        return resolve(
          new BaseSuccessResponse({
            data: {
              amount,
              vnpResponse: response.data,
            },
            message:
              "Đã hết vé, rất xin lỗi quý khách. Quý khách sẽ được hoàn lại tiền trong vòng từ 3 đến 5 ngày làm việc",
          }),
        );

        if (response.data.vnp_ResponseCode === "00") {
          return resolve(
            new BaseSuccessResponse({
              data: {
                amount,
                vnpResponse: response.data,
              },
              message:
                "Đã hết vé, rất xin lỗi quý khách. Quý khách sẽ được hoàn lại tiền trong vòng từ 3 đến 5 ngày làm việc",
            }),
          );
        } else {
          reject(
            new BaseErrorResponse({
              message: `VNPay hoàn tiền thất bại: ${response.data.vnp_Message} (${response.data.vnp_ResponseCode})`,
            }),
          );
        }
      } catch (error) {
        logger.error(`Refund Error: ${error.message}`, {
          userId,
          bookingId,
          error: error.stack,
        });

        reject(
          new BaseErrorResponse({
            message:
              error.response?.data?.message ||
              "Lỗi hệ thống khi xử lý hoàn tiền",
          }),
        );
      }
    });
  },
  refundPayment: ({ userId, booking }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const merchantId = process.env.VN_PAY_MERCHANT_ID;
        const hashSecret = process.env.VN_PAY_HASH_SECRET;
        const vnPayRefundUrl = process.env.VN_PAY_REFUND_URL;
        const createDate = dayjs().format("YYYYMMDDHHmmss");
        const ipAddr = "127.0.0.1";

        if (!booking._id || !booking.bookingDate) {
          return reject(
            new BaseErrorResponse({
              message: "Booking không có thông tin giao dịch hợp lệ",
            }),
          );
        }

        const vnpParams = {
          vnp_RequestId: `REFUND${dayjs().format("HHmmssSSS")}`,
          vnp_Version: "2.1.0",
          vnp_Command: "refund",
          vnp_CreateBy: userId,
          vnp_TmnCode: merchantId,
          vnp_TransactionId: booking._id,
          vnp_Amount: Math.round(booking.totalPrice),
          vnp_TransactionDate: dayjs(booking.bookingDate).format(
            "YYYYMMDDHHmmss",
          ),
          vnp_CreateDate: createDate,
          vnp_IpAddr: ipAddr,
          vnp_OrderInfo: `Hoan tien cho booking ${booking._id}`,
          vnp_TransactionType: "02",
        };

        const sortedParams = sortObject(vnpParams);
        const signData = queryString.stringify(sortedParams, { encode: false });
        const signature = generateSignature(signData, hashSecret);

        const response = await axios.post(
          vnPayRefundUrl,
          {
            ...sortedParams,
            vnp_SecureHash: signature,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );

        return resolve(
          new BaseSuccessResponse({
            data: response.data,
            message: "Yêu cầu hoàn tiền thành công",
          }),
        );

        if (response.data.vnp_ResponseCode === "00") {
          resolve(
            new BaseSuccessResponse({
              data: {
                bookingId,
                amount,
                transactionId: booking.transactionId,
                vnpResponse: response.data,
              },
              message: "Yêu cầu hoàn tiền thành công",
            }),
          );
        } else {
          reject(
            new BaseErrorResponse({
              message: `VNPay hoàn tiền thất bại: ${response.data.vnp_Message} (${response.data.vnp_ResponseCode})`,
            }),
          );
        }
      } catch (error) {
        logger.error(`Refund Error: ${error.message}`, {
          userId,
          bookingId,
          error: error.stack,
        });

        reject(
          new BaseErrorResponse({
            message:
              error.response?.data?.message ||
              "Lỗi hệ thống khi xử lý hoàn tiền",
          }),
        );
      }
    });
  },
};

export default paymentService;
