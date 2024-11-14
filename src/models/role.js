const { sequelize } = require("../services/common");
const { DataTypes } = require("sequelize");

const Role = sequelize.define(
  "role",
  {
    id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

async function insertDefaultRole() {
  try {
    await Role.upsert({
      id: "AD",
      name: "admin",
    });

    await Role.upsert({
      id: "CUS",
      name: "customer",
    });

    await Role.upsert({
      id: "SEL",
      name: "seller",
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { Role, insertDefaultRole };
