"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductImg extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductImg.belongsTo(models.Product);
    }
  }
  ProductImg.init(
    {
      src: DataTypes.STRING,
      orderNum: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ProductImg",
    }
  );
  return ProductImg;
};
