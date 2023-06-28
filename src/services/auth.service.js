import createHttpError from "http-errors";
import validator from "validator";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export const createUser = async (userData) => {
  const { name, email, picture, status, password } = userData;
  if (!name || !email || !picture || !status || !password) {
    throw createHttpError.BadRequest("Please fill all the fileds");
  }
  if (!validator.isLength(name, { min: 2, max: 16 })) {
    throw createHttpError.BadRequest(
      "Please make sure your name is between 2 and 16 characters."
    );
  }
  if (status && status.length > 64) {
    throw createHttpError.BadRequest(
      "Please make sure your status is less than 64 characters."
    );
  }
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest(
      "Please make sure your to provide a valid email"
    );
  }
  const userAlreadyExists = await UserModel.findOne({ email });
  if (userAlreadyExists) {
    throw createHttpError.Conflict("Please try again with different email");
  }

  if (!validator.isLength(password, { min: 6, max: 128 })) {
    throw createHttpError.BadRequest(
      "Please make sure your password is between 6 and 128 characters long"
    );
  }
  const user = await new UserModel({
    name,
    email,
    picture,
    status,
    password,
  }).save();
  return user;
};

export const signUser = async (email, password) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
  if (!user) {
    throw createHttpError.NotFound("Invalid Credentials");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw createHttpError.BadRequest("Invalid Credentails");
  }

  return user;
};
