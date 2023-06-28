import createHttpError from "http-errors";
import { createUser, signUser } from "../services/auth.service.js";
import { generateToken, validateToken } from "../services/token.service.js";
import { findUser } from "../services/user.service.js";
export const register = async (req, res, next) => {
  try {
    const { name, email, picture, status, password } = req.body;
    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });
    const accessToken = await generateToken(
      { userId: newUser._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );
    const refreshToken = await generateToken(
      { userId: newUser._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/v1/auth/refreshToken",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      message: "register success",
      accessToken,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        status: newUser.status,
        picture: newUser.picture,
      },
    });
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await signUser(email, password);
    const accessToken = await generateToken(
      { userId: user._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );
    const refreshToken = await generateToken(
      { userId: user._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/v1/auth/refreshToken",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        picture: user.picture,
      },
    });
  } catch (err) {
    next(err);
  }
};
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", { path: "/api/v1/auth/refreshToken" });
    return res.json({ message: "logged out" });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshtoken = req.cookies.refreshToken;
    if (!refreshtoken) {
      throw createHttpError.Unauthorized("Please login");
    }
    const validToken = await validateToken(
      refreshtoken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user =await findUser(validToken.userId);
    const accessToken = await generateToken(
      { userId: user._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        picture: user.picture,
      },
    });
  } catch (err) {
    next(err);
  }
};
