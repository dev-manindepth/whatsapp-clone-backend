import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: [true, "This email address already exists"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minLength: [
        6,
        "Pease make sure your password must be atleast 6 characters long",
      ],
      maxLength: [
        128,
        "Pease make sure your password must be less than 128 characters",
      ],
    },
    picture: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Hey there ! I am using whatsapp",
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (err) {
    next(err);
  }
});
const UserModel =
  mongoose.models.UserModel || mongoose.model("UserModel", userSchema);

export default UserModel;
