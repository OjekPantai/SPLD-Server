const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, PoliceSector } = require("../models");
const { sendResponse } = require("../utils/response");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
};

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
    res.cookie("token", token, cookieOptions);

    sendResponse(res, 200, "Login successful", { user });
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    ...cookieOptions,
    sameSite: "Lax",
  });

  sendResponse(res, 200, "Logout successful");
};

exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return sendResponse(res, 401, "Not authenticated");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }, // Exclude password
      include: PoliceSector,
    });

    if (!user) {
      return sendResponse(res, 401, "User not found");
    }

    sendResponse(res, 200, "User data retrieved", { user });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return sendResponse(res, 401, "Invalid token");
    }
    if (error instanceof jwt.TokenExpiredError) {
      return sendResponse(res, 401, "Token expired");
    }
    sendResponse(res, 500, error.message);
  }
};
