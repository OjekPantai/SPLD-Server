"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    static associate(models) {
      this.belongsTo(models.Report, { foreignKey: "reportId" });
      this.belongsTo(models.Narrative, {
        foreignKey: "narrativeId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Media.init(
    {
      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("foto", "video"),
        allowNull: false,
      },
      reportId: {
        type: DataTypes.INTEGER,
        references: {
          model: "reports",
          key: "id",
        },
      },
      narrativeId: {
        type: DataTypes.INTEGER,
        references: {
          model: "narratives",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
    },
    {
      sequelize,
      modelName: "Media",
      tableName: "Media",
    }
  );

  return Media;
};
