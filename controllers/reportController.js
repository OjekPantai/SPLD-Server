const { Report, Media, User, PoliceSector } = require("../models");
const { sendResponse } = require("../utils/response");

exports.createReport = async (req, res) => {
  try {
    const { title, content } = req.body;

    const report = await Report.create({
      title,
      content,
      userId: req.user.id,
    });

    if (req.files && req.files.length > 0) {
      const media = await Promise.all(
        req.files.map(async (file) => {
          const fileName = `${Date.now()}-${file.originalname}`;

          const { data, error } = await supabase.storage
            .from("media")
            .upload(fileName, file.buffer, {
              contentType: file.mimetype,
            });

          if (error) {
            console.error("Supabase Upload Error:", error.message);
            throw new Error("Failed to upload file");
          }

          const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/${fileName}`;

          return Media.create({
            filePath: fileUrl,
            type: file.mimetype.startsWith("image") ? "foto" : "video",
            reportId: report.id,
          });
        })
      );

      report.dataValues.media = media;
    }

    sendResponse(res, 201, "Report created successfully", report);
  } catch (error) {
    console.error("Error creating report:", error);
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
      include: [
        {
          model: Media,
        },
        {
          model: User,
          attributes: ["id", "name", "email", "role", "policeSectorId"],
          include: [
            {
              model: PoliceSector,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });
    if (!report) return sendResponse(res, 404, "Report not found");
    sendResponse(res, 200, "Report retrieved", report);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};
