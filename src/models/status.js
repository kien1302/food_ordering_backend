const { sequelize } = require("../services/common");
const { DataTypes, Op } = require("sequelize");

const Status = sequelize.define(
  "status",
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

async function insertDefaultStatus() {
  await Status.upsert({
    id: "PENDING",
    name: "order is waiting to be comfirmed",
  });
  await Status.upsert({
    id: "CONFIRMED",
    name: "order is confirmed",
  });
  await Status.upsert({
    id: "SHIPPING",
    name: "order is being shipped",
  });
  await Status.upsert({
    id: "SUCCESS",
    name: "order is shipped successfully",
  });
  await Status.upsert({
    id: "FAILED",
    name: "order is failed",
  });
}
// store -> product -> shipper -> customer
async function getStatusById(status_id) {
  return await Status.findAll({
    attributes: ["name"],
    where: {
      id: {
        [Op.eq]: status_id,
      },
    },
  });
}

module.exports = { Status, insertDefaultStatus, getStatusById };
