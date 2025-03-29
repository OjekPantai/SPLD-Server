const { sendResponse } = require("../utils/response");
const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("No token found in cookies");
    return sendResponse(res, 401, "Authentication required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    sendResponse(res, 401, "Invalid token");
  }
};
