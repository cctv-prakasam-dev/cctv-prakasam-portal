export function prepareOTPData(user, action, expireInMin = 15, type) {
    // const OTP = randomOTP();
    let otp;
    if (action === "SIGNIN_WITH_PHONE") {
        otp = "1234"; // Default OTP for phone sign-in
    }
    else if (action === "SIGNIN_WITH_EMAIL") {
        otp = randomOTP(); // Random OTP for email sign-in
    }
    else {
        throw new Error("Invalid action type");
    }
    let data;
    const expiresAt = new Date(Date.now() + expireInMin * 60 * 1000);
    if (type) {
        data = {
            action,
            otp,
            expires_at: expiresAt,
            email: user.email,
        };
    }
    else {
        data = {
            action,
            otp,
            expires_at: expiresAt,
            phone: user.phone,
        };
    }
    return data;
}
function randomOTP() {
    return `${Math.floor(1000 + Math.random() * 9000)}`;
}
