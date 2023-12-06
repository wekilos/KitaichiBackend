"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.ProductImg);
      Product.hasMany(models.ProductVideo);
      Product.belongsTo(models.Market);
      Product.belongsTo(models.Category);
      Product.belongsTo(models.SubCategory);
      Product.belongsTo(models.Brand);
    }
  }
  Product.init(
    {
      name_tm: DataTypes.STRING,
      name_ru: DataTypes.STRING,
      name_en: DataTypes.STRING,
      description_tm: DataTypes.TEXT,
      description_ru: DataTypes.TEXT,
      description_en: DataTypes.TEXT,
      price: DataTypes.REAL,
      usd_price: DataTypes.REAL,
      is_valyuta: DataTypes.BOOLEAN,
      is_discount: DataTypes.BOOLEAN,
      discount: DataTypes.REAL,
      discount_price: DataTypes.REAL,
      discount_usd: DataTypes.REAL,
      quantity: DataTypes.INTEGER,
      on_hand: DataTypes.BOOLEAN,
      code: DataTypes.STRING,
      is_moresale: DataTypes.BOOLEAN,
      is_selected: DataTypes.BOOLEAN,
      is_favorite: DataTypes.BOOLEAN,
      is_top: DataTypes.BOOLEAN,
      massa: DataTypes.STRING,
      link: DataTypes.TEXT,
      orderNum: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
