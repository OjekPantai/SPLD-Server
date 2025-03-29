const { Narrative, Media, Report, User, PoliceSector } = require("../models");
const { sendResponse } = require("../utils/response");

exports.createNarrative = async (req, res) => {
  try {
    const { title, content, reportId } = req.body;

    const report = await Report.findByPk(reportId);
    if (!report || report.status !== "submitted") {
      return sendResponse(
        res,
        400,
        "Report not available for narrative creation"
      );
    }

    const narrative = await Narrative.create({
      title,
      content,
      userId: req.user.id,
      reportId,
    });

    if (req.files) {
      const media = await Promise.all(
        req.files.map((file) =>
          Media.create({
            filePath: file.path,
            type: file.mimetype.startsWith("image") ? "foto" : "video",
            narrativeId: narrative.id,
          })
        )
      );
      narrative.dataValues.media = media;
    }

    sendResponse(res, 201, "Narrative created", narrative);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.publishNarrative = async (req, res) => {
  try {
    const narrative = await Narrative.findByPk(req.params.id);
    if (!narrative) return sendResponse(res, 404, "Narrative not found");

    narrative.status = "published";
    await narrative.save();

    sendResponse(res, 200, "Narrative published", narrative);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.getPublicNarratives = async (req, res) => {
  try {
    const narratives = await Narrative.findAll({
      where: {
        status: "published",
      },
      attributes: ["id", "title", "content", "createdAt"],
      include: [
        {
          model: Media,
          attributes: ["id", "filePath", "type"],
        },
        {
          model: Report,
          attributes: ["id", "title"],
          include: [
            {
              model: User,
              attributes: ["id", "name"],
              include: [
                {
                  model: PoliceSector,
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    sendResponse(res, 200, "Public narratives retrieved", narratives);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};
