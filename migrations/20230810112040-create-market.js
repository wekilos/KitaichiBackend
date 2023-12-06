"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Markets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name_tm: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      name_ru: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.STRING,
      },
      name_en: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      img: {
        type: Sequelize.STRING,
      },
      valyuta: { allowNull: false, defaultValue: 1, type: Sequelize.REAL },
      delivery_price: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.REAL,
      },
      description_tm: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.TEXT,
      },
      description_ru: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.TEXT,
      },
      description_en: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.TEXT,
      },
      address_tm: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.TEXT,
      },
      address_ru: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.TEXT,
      },
      address_en: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.TEXT,
      },
      CategoriesOfMarketId: {
        type: Sequelize.INTEGER,
      },
      orderNum: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      tel: Sequelize.STRING,
      is_cart: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      is_online: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      is_aksiya: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      active: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("Markets");
  },
};
