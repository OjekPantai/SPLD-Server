"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Media", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      filePath: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.ENUM("foto", "video"),
      },
      reportId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Reports",
          key: "id",
        },
      },
      narrativeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Narratives",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Media");
  },
};
