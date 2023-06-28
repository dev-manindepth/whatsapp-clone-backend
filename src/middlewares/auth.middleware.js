import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
export default async function (req, res, next) {
  if (!req.headers["authorization"])
    return next(createHttpError.Unauthorized());

  const bearerToken = req.headers["authorization"].split("Bearer")[1].trim();
  console.log(bearerToken);
  jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return next(createHttpError.Unauthorized());
    } else {
      req.user = payload;
      next();
    }
  });
}
