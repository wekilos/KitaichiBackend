"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Market extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Market.belongsTo(models.CategoriesOfMarket);
      Market.hasMany(models.Category);
      Market.hasMany(models.SubCategory);
      Market.hasMany(models.Product);
      Market.hasMany(models.Order);
      Market.hasMany(models.SubAdmin);
    }
  }
  Market.init(
    {
      name_tm: DataTypes.STRING,
      name_ru: DataTypes.STRING,
      name_en: DataTypes.STRING,
      img: DataTypes.STRING,
      valyuta: DataTypes.REAL,
      delivery_price: DataTypes.REAL,
      description_tm: DataTypes.TEXT,
      description_ru: DataTypes.TEXT,
      description_en: DataTypes.TEXT,
      address_tm: DataTypes.TEXT,
      address_ru: DataTypes.TEXT,
      address_en: DataTypes.TEXT,
      orderNum: DataTypes.INTEGER,
      tel: DataTypes.STRING,
      is_cart: DataTypes.BOOLEAN,
      is_online: DataTypes.BOOLEAN,
      is_aksiya: DataTypes.BOOLEAN,
      active: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Market",
    }
  );
  return Market;
};
