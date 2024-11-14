const { sequelize } = require("../services/common");
const { DataTypes, Op } = require("sequelize");

const ProductType = sequelize.define(
  "product_type",
  {
    id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    store_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "store",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

async function insertProductType(id, name, store_id) {
  try {
    await ProductType.create({
      id: id,
      name: name,
      store_id,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function editProductType(id, name) {
  try {
    await ProductType.update(
      {
        name: name,
      },
      {
        where: {
          id: {
            [Op.eq]: id,
          },
        },
      }
    );

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getProductTypeByStoreId(store_id) {
  return await ProductType.findAll({
    attributes: ["id", "name"],
    where: {
      store_id: {
        [Op.eq]: store_id,
      },
    },
  });
}

async function getProductTypeById(id) {
  try {
    return await ProductType.findAll({
      attributes: ["name"],
      where: {
        id: id,
      },
    });
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getProductTypeByIdAndStoreId(type_id, store_id) {
  return await ProductType.findAll({
    where: {
      [Op.and]: [
        {
          id: {
            [Op.eq]: type_id,
          },
          store_id: {
            [Op.eq]: store_id,
          },
        },
      ],
    },
  });
}

module.exports = {
  ProductType,
  getProductTypeById,
  insertProductType,
  getProductTypeByStoreId,
  getProductTypeByIdAndStoreId,
  editProductType,
};
