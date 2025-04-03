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

exports.updatePoliceSector = async (req, res) => {
  try {
    const sector = await PoliceSector.findByPk(req.params.id);
    if (!sector) return sendResponse(res, 404, "Police sector not found");
    await sector.update(req.body);
    sendResponse(res, 200, "Police sector updated", sector);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.deletePoliceSector = async (req, res) => {
  try {
    const sector = await PoliceSector.findByPk(req.params.id);
    if (!sector) return sendResponse(res, 404, "Police sector not found");
    await sector.destroy();
    sendResponse(res, 200, "Police sector deleted");
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};
