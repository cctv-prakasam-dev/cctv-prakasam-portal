import type { StatusCode } from "hono/utils/http-status";

import BaseException from "./baseException.js";

class BrevoErrorException extends BaseException {
  constructor(
    status: StatusCode,
    message: string,
    name: string,
    isOperational: boolean,
    errData?: string,
  ) {
    super(status, message, name, isOperational, errData);
  }
}

export default BrevoErrorException;
