import { sign, verify } from "hono/jwt";
import { JwtTokenExpired, JwtTokenInvalid, JwtTokenSignatureMismatched, } from "hono/utils/jwt/types";
import { jwtConfig } from "../config/jwtConfig.js";
import { DEF_400, TOKEN_EXPIRED, TOKEN_INVALID, TOKEN_MISSING, TOKEN_SIG_MISMATCH, USER_INACTIVE } from "../constants/appMessages.js";
import { users } from "../db/schema/users.js";
import UnauthorizedException from "../exceptions/unauthorizedException.js";
import { getRecordById } from "../services/db/baseDbService.js";
async function genJWTTokens(payload) {
    const now = Math.floor(Date.now() / 1000);
    const access_token_payload = {
        ...payload,
        exp: now + jwtConfig.access_token_expires_in,
    };
    const refresh_token_payload = {
        ...payload,
        exp: now + jwtConfig.refresh_token_expires_in,
    };
    const access_token = await sign(access_token_payload, jwtConfig.secret, "HS256");
    const refresh_token = await sign(refresh_token_payload, jwtConfig.secret, "HS256");
    return {
        access_token,
        refresh_token,
        refresh_token_expires_at: refresh_token_payload.exp,
    };
}
async function genJWTTokensForUser(userId) {
    // Create Payload
    const payload = {
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
    };
    // Generate Tokens
    return await genJWTTokens(payload);
}
async function verifyJWTToken(token) {
    try {
        const decodedPayload = await verify(token, jwtConfig.secret, "HS256");
        return decodedPayload;
    }
    catch (error) {
        if (error instanceof JwtTokenInvalid) {
            throw new UnauthorizedException(TOKEN_INVALID);
        }
        if (error instanceof JwtTokenExpired) {
            throw new UnauthorizedException(TOKEN_EXPIRED);
        }
        if (error instanceof JwtTokenSignatureMismatched) {
            throw new UnauthorizedException(TOKEN_SIG_MISMATCH);
        }
        throw error;
    }
}
async function getUserDetailsFromToken(c) {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.substring(7, authHeader.length);
    if (!token) {
        throw new UnauthorizedException(TOKEN_MISSING);
    }
    const decodedPayload = await verifyJWTToken(token);
    // Check if the user is existing in the system - in case the user is removed from the system the jwt token can still be valid
    const user = await getRecordById(users, decodedPayload.sub);
    if (!(user?.active && user)) {
        throw new UnauthorizedException(USER_INACTIVE || DEF_400);
    }
    const { created_at, updated_at, ...userDetails } = user;
    return userDetails;
}
export { genJWTTokens, genJWTTokensForUser, getUserDetailsFromToken, verifyJWTToken, };
