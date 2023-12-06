"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubAdmin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SubAdmin.belongsTo(models.Market);
    }
  }
  SubAdmin.init(
    {
      phonenumber: DataTypes.STRING,
      name: DataTypes.STRING,
      lastname: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "SubAdmin",
    }
  );
  return SubAdmin;
};
