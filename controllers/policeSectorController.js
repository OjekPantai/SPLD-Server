const { PoliceSector } = require("../models");
const { sendResponse } = require("../utils/response");

exports.getAllPoliceSectors = async (req, res) => {
  try {
    const sectors = await PoliceSector.findAll();
    sendResponse(res, 200, "Police sectors retrieved", sectors);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.createPoliceSector = async (req, res) => {
  try {
    const sector = await PoliceSector.create(req.body);
    sendResponse(res, 201, "Police sector created", sector);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};
