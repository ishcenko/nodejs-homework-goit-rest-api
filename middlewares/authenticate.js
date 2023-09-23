const jwt = require("jsonwebtoken");
const { cteateError } = require("../helpers");
const { User } = require("../models/user");

const { SEKRET_KEY } = process.env;
const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(cteateError(401), "Not authorization");
  }
  try {
    const { id } = jwt.verify(token, SEKRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(cteateError(401), "Not authorization");
    }
    req.user = user;
    next();
  } catch {
    next(cteateError(401), "Not authorization");
  }
};
module.exports = authenticate;
