"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PoliceSector extends Model {
    static associate(models) {
      this.hasMany(models.User, { foreignKey: "policeSectorId" });
    }
  }

  PoliceSector.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "PoliceSector",
      tableName: "PoliceSectors",
    }
  );

  return PoliceSector;
};
