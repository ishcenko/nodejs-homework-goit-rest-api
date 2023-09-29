const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const { CteateError, ctrlWrapper } = require("../helpers");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const gravatar = require("gravatar");

require("dotenv").config();

const { SECRET_KEY } = process.env;
const avatarDir = path.join(__dirname, "../", "pablic", "avatars");
const registeredUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw CteateError(409, "Email already in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUsers = await User.create({ ...req.body, password: hashedPassword });
  res.status(201).json({
    email: newUsers.email,
    subscription: newUsers.subscription,
    avatarURL,
  });
};
const updateAvatars = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalnname } = req.file;
  const filename = `${_id}_${originalnname}`;
  Jimp.read(tempUpload)
    .then((avatar) => {
      return avatar.resize(300, 300).write(resultUpload);
    })
    .catch((err) => {
      throw err;
    });
  const resultUpload = path.join(avatarDir, filename);
  await fs.unlink(tempUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

const loginUsers = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw CteateError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw CteateError(401, "Email or password invalid");
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "8h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({});
};

const updateSubscription = async (req, res) => {
  const user = req.user;

  const result = await User.findByIdAndUpdate(user._id, req.body, {
    new: true,
  });
  if (!result) {
    throw CteateError(404, "User not found");
  }
  const { name, subscription } = result;
  res.json({ name, subscription });
};

module.exports = {
  registerUser: ctrlWrapper(registeredUser),
  loginUser: ctrlWrapper(loginUsers),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logoutUser: ctrlWrapper(logoutUser),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatars: ctrlWrapper(updateAvatars),
};
