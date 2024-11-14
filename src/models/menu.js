const { sequelize } = require("../services/common");
const { DataTypes, QueryTypes } = require("sequelize");
const { Op } = require("sequelize");
const { ProductType } = require("./product_type");
const { Store } = require("./store");

const Menu = sequelize.define(
  "menu",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    store_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "store",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
    },
    type_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "product_type",
        key: "id",
      },
    },
    image: {
      type: DataTypes.STRING(64),
    },
    price: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    stock: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    out_of_stock: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    del_flag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_date: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    updated_date: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

async function addProduct(store_id, name, description, type_id, image, price, stock, created_date, stock, created_date) {
  try {
    await Menu.create({
      store_id: store_id,
      name: name,
      description: description,
      type_id: type_id,
      image: image,
      price: price,
      stock: stock,
      created_date: created_date,
      updated_date: created_date,
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function getProductsByStore(store_id) {
  return await sequelize.query(
    "select id, name, store_id 'sis' ,(select pt.name from product_type pt where pt.id = m.type_id) 'type', description, " +
      "image, price, stock, out_of_stock, del_flag, created_date, updated_date from menu m where m.store_id = '" +
      store_id +
      "'",
    {
      type: QueryTypes.SELECT,
    }
  );
}

async function getProductById(id) {
  try {
    const data = await sequelize.query(
      "select m.id, m.store_id, m.name, type_id, pt.name 'type_name', m.description, image, price, stock, out_of_stock, del_flag, created_date, updated_date " +
        " from menu m inner join product_type pt on m.type_id = pt.id where m.id = " +
        id,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (data.length > 0) return data;
    else return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getAllProduct() {
  try {
    const data = await sequelize.query(
      "select m.id, store_id, m.name, type_id, pt.name 'type_name', m.description, image, price, stock, out_of_stock, del_flag, created_date, updated_date " +
        " from menu m inner join product_type pt on m.type_id = pt.id",
      {
        type: QueryTypes.SELECT,
      }
    );
    if (data.length > 0) return data;
    else return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function updateProductById(id, name, description, image, type_id, price, stock, updated_date) {
  try {
    await Menu.update(
      {
        name: name,
        description: description,
        type_id: type_id,
        image: image,
        price: price,
        stock: stock,
        updated_date: updated_date,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function getProductByIdAndStoreId(id, store_id) {
  return await Menu.findAll({
    where: {
      [Op.and]: [
        {
          id: {
            [Op.eq]: id,
          },
          store_id: {
            [Op.eq]: store_id,
          },
        },
      ],
    },
  });
}

async function getMostOrderedProductsDesc() {
  try {
    const data = await sequelize.query(
      "select m.id 'pid', m.store_id 'sid', " +
        "(SELECT count(product_id) 'amount' FROM food_delivery.order_detail od where od.product_id = m.id " +
        "group by product_id order by amount desc ) 'ord_amount', " +
        "(SELECT s.name FROM food_delivery.store s where s.id = m.store_id) 'store_name' " +
        ", name, description, " +
        "(SELECT pt.name FROM food_delivery.product_type pt where pt.id = m.type_id) 'type' " +
        ",image, price , stock, m.out_of_stock, m.del_flag, m.created_date, m.updated_date from menu m order by ord_amount desc ",
      {
        type: QueryTypes.SELECT,
      }
    );

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getRandomProductInStore(store_id, product_id) {
  try {
    const data = await sequelize.query(
      "SELECT id, description, (select name from product_type pt where pt.id = m.type_id) 'type_name', name, image, price, stock, " +
        " created_date, updated_date FROM food_delivery.menu m where id <> " +
        product_id +
        " and store_id = '" +
        store_id +
        "' order by rand() limit 4 ",
      {
        type: QueryTypes.SELECT,
      }
    );

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getProductsBySearch(name) {
  try {
    const data = await sequelize.query("select id, name, image from menu where name like '%" + name + "%'", {
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getProductDetail(id) {
  try {
    //Filter product info
    const p_info = await sequelize.query(
      "SELECT m.id, m.store_id 'sid' ,m.name, m.description 'des', p.name 'type', m.image, price, stock, m.out_of_stock, m.del_flag, " +
        "m.created_date, m.updated_date from menu m inner join product_type p on m.type_id = p.id where m.id = " +
        id,
      {
        type: QueryTypes.SELECT,
      }
    );
    //Filter product store
    const p_store = await sequelize.query(
      "SELECT s.id 'sid', owner_id, s.name, s.image ,s.address, s.description 'des', (select pt.name from product_type pt where pt.id = m.type_id) 'type_name', s.active_date " +
        "from menu m inner join store s on m.store_id = s.id where m.id = " +
        id,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (p_info.length > 0 && p_store.length > 0) {
      //Save before deleting id, bring [id] out to be the main key
      let id = p_info[0].id;
      delete p_info[0].id;
      let product_res = {
        id: id,
        info: p_info[0],
        store: p_store[0],
      };
      return product_res;
    } else return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getBestSoldProductsFromStore(store_id) {
  try {
    const data = await sequelize.query(
      "select product_id, Sum(quantity) 'sum', (select name from menu m where od.product_id = m.id) 'product_name' " +
        "from order_detail od where store_id='" +
        store_id +
        "' group by product_id limit 3",
      {
        type: QueryTypes.SELECT,
      }
    );
    return data;
  } catch (error) {
    return error;
  }
}

module.exports = {
  Menu,
  getRandomProductInStore,
  getProductsBySearch,
  getAllProduct,
  getProductById,
  addProduct,
  getProductDetail,
  getProductsByStore,
  updateProductById,
  getProductByIdAndStoreId,
  getMostOrderedProductsDesc,
  getBestSoldProductsFromStore,
};
