"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Narrative extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId" });
      this.belongsTo(models.Report, { foreignKey: "reportId" });
      this.hasMany(models.Media, { foreignKey: "narrativeId" });
    }
  }

  Narrative.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("draft", "published"),
        defaultValue: "draft",
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      reportId: {
        type: DataTypes.INTEGER,
        references: {
          model: "reports",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Narrative",
      tableName: "narratives",
    }
  );

  return Narrative;
};
