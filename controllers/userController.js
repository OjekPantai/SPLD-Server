const { User, PoliceSector } = require("../models");
const { sendResponse } = require("../utils/response");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: PoliceSector,
          attributes: ["id", "name"],
        },
      ],
    });

    sendResponse(res, 200, "Users retrieved successfully", users);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: PoliceSector,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    sendResponse(res, 200, "User retrieved successfully", user);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, policeSectorId } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendResponse(res, 400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      policeSectorId,
    });

    const userData = user.get();
    delete userData.password;

    sendResponse(res, 201, "User created successfully", userData);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, policeSectorId } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    // Update data
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (policeSectorId) user.policeSectorId = policeSectorId;

    // Update password jika ada
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Exclude password dari response
    const userData = user.get();
    delete userData.password;

    sendResponse(res, 200, "User updated successfully", userData);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    await user.destroy();

    sendResponse(res, 200, "User deleted successfully");
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: PoliceSector,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    sendResponse(res, 200, "Current user retrieved", user);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};
