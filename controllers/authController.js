const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, PoliceSector } = require("../models");
const { sendResponse } = require("../utils/response");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      include: PoliceSector,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendResponse(res, 401, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.JWT_COOKIE_SECURE === "true",
      maxAge: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
    });

    sendResponse(res, 200, "Login successful", { user });
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  sendResponse(res, 200, "Logout successful");
};
