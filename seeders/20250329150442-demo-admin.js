"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const [policeSector] = await queryInterface.sequelize.query(
      `SELECT id FROM "PoliceSectors" WHERE name = 'Admin Sector' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    let sectorId;

    if (!policeSector) {
      await queryInterface.bulkInsert("PoliceSectors", [
        {
          name: "Admin Sector",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      // 3. Dapatkan ID yang baru dibuat (PostgreSQL menggunakan RETURNING)
      const [newSector] = await queryInterface.sequelize.query(
        `SELECT id FROM "PoliceSectors" WHERE name = 'Admin Sector' LIMIT 1`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      sectorId = newSector.id;
    } else {
      sectorId = policeSector.id;
    }

    const password = await bcrypt.hash("admin123", 10);

    return queryInterface.bulkInsert("Users", [
      {
        name: "Super Admin",
        email: "admin@example.com",
        password: password,
        role: "admin",
        policeSectorId: sectorId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { email: "admin@example.com" });
    await queryInterface.bulkDelete("PoliceSectors", { name: "Admin Sector" });
  },
};
