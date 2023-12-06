"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.OrderProduct);
      Order.belongsTo(models.User);
      Order.belongsTo(models.Market);
    }
  }
  Order.init(
    {
      price: DataTypes.REAL,
      discount_price: DataTypes.REAL,
      delivery_price: DataTypes.REAL,
      status: DataTypes.STRING,
      code: DataTypes.STRING,
      address: DataTypes.STRING,
      note: DataTypes.STRING,
      admin_note: DataTypes.STRING,
      awans: DataTypes.REAL,
      massa: DataTypes.REAL,
      massa_price: DataTypes.REAL,
      active: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
