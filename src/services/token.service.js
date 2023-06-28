import { sign, verifyToken } from "../utils/token.utils.js";

export const generateToken = async (payload,expiresIn,secret)=>{
    const token = await sign(payload,expiresIn,secret);
    return token;
}
export const validateToken = async (token, secret) => {
  const isTokenValid = await verifyToken(token, secret);
  return isTokenValid;
};