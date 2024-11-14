const { sequelize } = require("../services/common");
const { DataTypes } = require("sequelize");

const StoreType = sequelize.define(
  "store_type",
  {
    id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

async function getAllType() {
  return StoreType.findAll();
}

module.exports = { StoreType, getAllType };
