// exceptions/googleOAuthReauthRequiredException.js
import BaseException from "./baseException.js";

export default class GoogleOAuthReauthRequiredException extends BaseException {
  constructor(message: string, errData?: string) {
    super(401, message, "GoogleOAuthReauthRequiredException", true, errData);
  }
}
