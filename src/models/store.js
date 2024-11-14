const { sequelize } = require("../services/common");
const { DataTypes, QueryTypes } = require("sequelize");

const Store = sequelize.define(
  "store",
  {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
    },
    owner_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: "account",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(255),
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
    },
    type_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "store_type",
        key: "id",
      },
    },
    image: {
      type: DataTypes.STRING(64),
    },
    active_date: {
      type: DataTypes.STRING(25),
    },
    created_date: {
      type: DataTypes.STRING(25),
    },
  },
  {
    timestamps: false,
  }
);

async function insertStore(id, owner_id, name, address, description, image, type_id, created_date) {
  try {
    await Store.create({
      id: id,
      owner_id: owner_id,
      name: name,
      address: address,
      description: description,
      image: image,
      type_id: type_id,
      active_date: created_date,
      created_date: created_date,
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateStoreById(id, owner_id, name, address, description, type_id, created_date) {
  try {
    const data = await Store.update(
      {
        name,
        address,
        description,
        type_id,
        created_date,
      },
      {
        where: {
          id: id,
          owner_id: owner_id,
        },
      }
    );
    if (data.length > 0) return data;
    else return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function checkStoreByName(name) {
  try {
    const data = await Store.findAll({
      where: {
        name: name,
      },
    });
    if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getStoreById(id) {
  try {
    const data = await sequelize.query(
      "SELECT name, address, description, " +
        "(select st.name from store_type st where st.id = s.type_id) 'type_name', image, active_date FROM food_delivery.store s where s.id = '" +
        id +
        "'",
      {
        type: QueryTypes.SELECT,
      }
    );
    if (data.length > 0) {
      return data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getUserStore(owner_id) {
  try {
    return await Store.findAll({
      where: {
        owner_id: owner_id,
      },
    });
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getAll() {
  try {
    return await sequelize.query(
      "select id, owner_id, name, address, description, " +
        "(select st.name from store_type st where st.id = s.type_id) 'type_name', image, active_date from store s",
      {
        type: QueryTypes.SELECT,
      }
    );
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = {
  Store,
  insertStore,
  checkStoreByName,
  getAll,
  getStoreById,
  updateStoreById,
  getUserStore,
};
