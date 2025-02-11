import * as crypto from "crypto";

export default function generateSignature(queryString, hashSecret) {
  const hmac = crypto.createHmac("sha512", hashSecret);
  hmac.update(Buffer.from(queryString, "utf-8"));
  const hashCode = hmac.digest("hex");
  return hashCode;
}
