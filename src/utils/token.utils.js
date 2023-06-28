import jwt from "jsonwebtoken";
import logger from "../configs/logger.js";
export const sign = async (payload, expiresIn, secret) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: expiresIn }, (err, token) => {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export const verifyToken = async (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, payload) => {
      if (error) {
        logger.error(error);
        resolve(null);
      } else {
        resolve(payload);
      }
    });
  });
};
