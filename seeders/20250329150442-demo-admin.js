"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Cek tabel dengan nama yang sesuai migration
    const [policeSector] = await queryInterface.sequelize.query(
      `SELECT id FROM PoliceSectors WHERE name = 'Admin Sector' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    let sectorId;

    if (!policeSector) {
      // 2. Insert tanpa returning (untuk MySQL/MariaDB)
      await queryInterface.bulkInsert("PoliceSectors", [
        {
          name: "Admin Sector",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      // 3. Dapatkan ID terakhir
      const [[{ id }]] = await queryInterface.sequelize.query(
        "SELECT LAST_INSERT_ID() as id"
      );
      sectorId = id;
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
