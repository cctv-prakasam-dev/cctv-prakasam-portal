export const DEF_SERVICE_RUNNING = "Service is up & running";
export const DEF_SUCCESS_RESP = "Success";
export const DEF_ERROR_RESP = "Internal server error";

export const DEF_422 = "Validation failed";
export const DEF_404 = "Data not found";
export const DEF_409 = "Data conflict encountered";
export const DEF_401 = "Unauthorized request";
export const DEF_403 = "Forbidden request";
export const DEF_400 = "Bad request";

export const NAME_422 = "Unprocessable entity";
export const NAME_404 = "Not found";
export const NAME_409 = "Conflict";
export const NAME_401 = "Unauthorized";
export const NAME_403 = "Forbidden";
export const NAME_400 = "Bad request";

export const SERVICES_FETCHED = "Services fetched successfully.";
export const ISSUES_FETCHED = "Issues fetched successfully.";
export const INVALID_INPUT = "Invalid input";
export const ISSUES_NOT_FOUND = "Issues not found";

export const LOGIN_VALIDATION_ERROR
  = "Login details provided do not meet the required validation criteria";
export const PASSWORD_INVALID = "Password is invalid";
export const PASSWORD_SHORT = "Password too short, min length is 6 characters";
export const PASSWORD_MISSING = "Password is missing";
export const TOKEN_INVALID = "Authorization token is invalid";
export const TOKEN_EXPIRED = "Authorization token expired";
export const TOKEN_SIG_MISMATCH = "Authorization token signature mismatched";
export const TOKEN_MISSING = "Authorization token missing";
export const FORBIDDEN_ACCESS
  = "You are not authorized to access this resource";
export const USER_PAYLOAD_MISSING = "User Payload is missing";
export const LOGIN_EMAIL_NOT_FOUND
  = "Given email not found in the system. Please check with the manager";
export const LOGIN_PHONE_NOT_FOUND
  = "Given phone number not found in the system. Please check with the manager";
export const LOGIN_DONE = "Login successful";
export const ACCOUNT_INACTIVE = "Account inactive. Please contact manager";
export const RT_NOT_FOUND = "Refresh token not found";
export const TOKENS_GENERATED = "Tokens generated successfully";
export const USER_INACTIVE = "Your status is inactive. Please contact manager";
export const USER_NOT_FOUND = "User not found";
export const PASSWORDS_NOT_MATCHING = "The passwords do not match";
export const PASSWORDS_VALIDATION_ERROR
  = "Password details provided do not meet the required validation criteria";
export const CURRENT_PASSWORD_WRONG = "Provided current password is wrong";
export const PASSWORD_CHANGED = "Password changed successfully";
export const PASSWORD_RESET_DONE = "Password reset done successfully";
export const FP_EMAIL_ERROR = "Error while sending email to reset password";
export const FP_EMAIL_SENT
  = "An email to reset your password is sent to the email provided. Please check your email";
export const RESET_TOKEN_NOT_FOUND = "Reset token not found";
export const FP_EMAIL = "Error while sending email";
export const CASE_ISSUES_FETCHED = "Case issues fetched successfully";
export const PAYMENT_METHOD_CAPTURED = "Payment method captured successfully";
export const CASE_CNR_ADDED = "CNR number added successfully";
export const CASE_OPPONENT_UPDATED = "Case opponent updated successfully";
export const CASE_OPPONENT_VALIDATION_ERROR
  = "Update case opponent details provided do not meet required validation criteria";

// Auth messages
export const REGISTER_VALIDATION_ERROR
  = "Registration details provided do not meet the required validation criteria";
export const REGISTER_DONE = "Registration successful";
export const EMAIL_ALREADY_EXISTS = "An account with this email already exists";
export const REFRESH_TOKEN_VALIDATION_ERROR
  = "Refresh token details provided do not meet the required validation criteria";
export const FORGOT_PASSWORD_VALIDATION_ERROR
  = "Forgot password details provided do not meet the required validation criteria";
export const RESET_PASSWORD_VALIDATION_ERROR
  = "Reset password details provided do not meet the required validation criteria";
export const VERIFY_EMAIL_VALIDATION_ERROR
  = "Verify email details provided do not meet the required validation criteria";
export const VERIFICATION_EMAIL_SENT
  = "A verification email has been sent. Please check your inbox";
export const EMAIL_VERIFIED = "Email verified successfully";
export const INVALID_VERIFICATION_TOKEN = "Invalid or expired verification token";
export const INVALID_RESET_TOKEN = "Invalid or expired reset token";
export const LOGOUT_DONE = "Logged out successfully";

// Categories messages
export const CATEGORIES_FETCHED = "Categories fetched successfully";
export const CATEGORY_FETCHED = "Category fetched successfully";
export const CATEGORY_CREATED = "Category created successfully";
export const CATEGORY_UPDATED = "Category updated successfully";
export const CATEGORY_DELETED = "Category deleted successfully";
export const CATEGORY_NOT_FOUND = "Category not found";
export const CREATE_CATEGORY_VALIDATION_ERROR
  = "Category details provided do not meet the required validation criteria";
export const UPDATE_CATEGORY_VALIDATION_ERROR
  = "Update category details provided do not meet the required validation criteria";

// Videos messages
export const VIDEOS_FETCHED = "Videos fetched successfully";
export const VIDEO_FETCHED = "Video fetched successfully";
export const FEATURED_VIDEOS_FETCHED = "Featured videos fetched successfully";
export const TRENDING_VIDEOS_FETCHED = "Trending videos fetched successfully";
export const VIDEO_CREATED = "Video created successfully";
export const VIDEO_UPDATED = "Video updated successfully";
export const VIDEO_DELETED = "Video deleted successfully";
export const VIDEO_NOT_FOUND = "Video not found";
export const CREATE_VIDEO_VALIDATION_ERROR
  = "Video details provided do not meet the required validation criteria";
export const UPDATE_VIDEO_VALIDATION_ERROR
  = "Update video details provided do not meet the required validation criteria";

// Newsletter messages
export const NEWSLETTER_SUBSCRIBED = "Subscribed to newsletter successfully";
export const NEWSLETTER_SUBSCRIBERS_FETCHED = "Newsletter subscribers fetched successfully";
export const NEWSLETTER_SUBSCRIBER_DELETED = "Newsletter subscriber removed successfully";
export const NEWSLETTER_SUBSCRIBER_NOT_FOUND = "Newsletter subscriber not found";
export const SUBSCRIBE_NEWSLETTER_VALIDATION_ERROR
  = "Newsletter subscription details provided do not meet the required validation criteria";

// Breaking News messages
export const BREAKING_NEWS_FETCHED = "Breaking news fetched successfully";
export const BREAKING_NEWS_CREATED = "Breaking news created successfully";
export const BREAKING_NEWS_UPDATED = "Breaking news updated successfully";
export const BREAKING_NEWS_DELETED = "Breaking news deleted successfully";
export const BREAKING_NEWS_NOT_FOUND = "Breaking news not found";
export const CREATE_BREAKING_NEWS_VALIDATION_ERROR
  = "Breaking news details provided do not meet the required validation criteria";
export const UPDATE_BREAKING_NEWS_VALIDATION_ERROR
  = "Update breaking news details provided do not meet the required validation criteria";

// Featured Content messages
export const FEATURED_CONTENT_FETCHED = "Featured content fetched successfully";
export const FEATURED_CONTENT_CREATED = "Featured content created successfully";
export const FEATURED_CONTENT_UPDATED = "Featured content updated successfully";
export const FEATURED_CONTENT_DELETED = "Featured content deleted successfully";
export const FEATURED_CONTENT_NOT_FOUND = "Featured content not found";
export const CREATE_FEATURED_CONTENT_VALIDATION_ERROR
  = "Featured content details provided do not meet the required validation criteria";
export const UPDATE_FEATURED_CONTENT_VALIDATION_ERROR
  = "Update featured content details provided do not meet the required validation criteria";

// Settings messages
export const SETTINGS_FETCHED = "Settings fetched successfully";
export const SETTING_FETCHED = "Setting fetched successfully";
export const SETTING_UPDATED = "Setting updated successfully";
export const SETTING_NOT_FOUND = "Setting not found";
export const UPDATE_SETTING_VALIDATION_ERROR
  = "Setting details provided do not meet the required validation criteria";

// Dashboard messages
export const DASHBOARD_STATS_FETCHED = "Dashboard stats fetched successfully";
export const USERS_FETCHED = "Users fetched successfully";
export const USER_ROLE_UPDATED = "User role updated successfully";
export const UPDATE_USER_ROLE_VALIDATION_ERROR
  = "User role details provided do not meet the required validation criteria";

// Contact messages
export const CONTACT_EMAIL_SENT = "Your message has been sent successfully";
export const CONTACT_VALIDATION_ERROR
  = "Contact form details provided do not meet the required validation criteria";

// YouTube Sync messages
export const YOUTUBE_SYNC_DONE = "YouTube videos synced successfully";
