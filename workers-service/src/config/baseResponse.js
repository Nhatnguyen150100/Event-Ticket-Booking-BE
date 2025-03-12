import { DEFINE_STATUS_RESPONSE } from "./statusResponse.js";

export class BaseResponse {
  constructor({ status, data, message }) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export class BaseResponseList extends BaseResponse {
  constructor({ status, list, totalCount, message }) {
    const data = { content: list, totalCount }
    super({ status, data, message });
  }
}

export class BaseErrorResponse extends BaseResponse {
  constructor({ message }) {
    super({ status: DEFINE_STATUS_RESPONSE.ERROR, data: null, message });
  }
}

export class BaseSuccessResponse extends BaseResponse {
  constructor({ data, message }) {
    super({ status: DEFINE_STATUS_RESPONSE.SUCCESS, data, message });
  }
}
