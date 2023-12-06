"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.belongsTo(models.Market);
      Category.hasMany(models.SubCategory);
      Category.hasMany(models.Product);
    }
  }
  Category.init(
    {
      name_tm: DataTypes.STRING,
      name_ru: DataTypes.STRING,
      name_en: DataTypes.STRING,
      img: DataTypes.STRING,
      orderNum: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
