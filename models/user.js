"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Report, { foreignKey: "userId" });
      this.hasMany(models.Narrative, { foreignKey: "userId" });
      this.belongsTo(models.PoliceSector, {
        foreignKey: "policeSectorId",
        allowNull: false,
      });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("polsek", "humas", "admin"),
        defaultValue: "polsek",
        allowNull: false,
      },
      policeSectorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "police_sectors",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );

  return User;
};
