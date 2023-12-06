"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      price: { allowNull: false, defaultValue: 0, type: Sequelize.REAL },
      discount_price: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.REAL,
      },
      delivery_price: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.REAL,
      },
      status: { allowNull: false, defaultValue: "1", type: Sequelize.STRING },
      code: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      address: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      note: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      admin_note: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.STRING,
      },
      awans: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.REAL,
      },
      massa: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.REAL,
      },
      massa_price: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.REAL,
      },
      MarketId: {
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
      },
      active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      deleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("Orders");
  },
};
