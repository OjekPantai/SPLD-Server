const { Report, Media, User } = require("../models");
const { sendResponse } = require("../utils/response");

exports.createReport = async (req, res) => {
  try {
    const { title, content } = req.body;
    const report = await Report.create({
      title,
      content,
      userId: req.user.id,
    });

    if (req.files) {
      const media = await Promise.all(
        req.files.map((file) =>
          Media.create({
            filePath: file.path,
            type: file.mimetype.startsWith("image") ? "foto" : "video",
            reportId: report.id,
          })
        )
      );
      report.dataValues.media = media;
    }

    sendResponse(res, 201, "Report created successfully", report);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.submitReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) return sendResponse(res, 404, "Report not found");

    if (report.userId !== req.user.id) {
      return sendResponse(res, 403, "Not authorized");
    }

    report.status = "submitted";
    await report.save();

    sendResponse(res, 200, "Report submitted successfully", report);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      where: req.user.role === "polsek" ? { userId: req.user.id } : {},
      include: [
        {
          model: Media,
        },
        {
          model: User,
          attributes: ["id", "name", "email", "role", "policeSectorId"],
        },
      ],
    });
    sendResponse(res, 200, "Reports retrieved", reports);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: ["User", "Media"],
    });
    if (!report) return sendResponse(res, 404, "Report not found");
    sendResponse(res, 200, "Report retrieved", report);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};
