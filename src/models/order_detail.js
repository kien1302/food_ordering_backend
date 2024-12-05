const { sequelize } = require("../services/common");
const { DataTypes, QueryTypes, where } = require("sequelize");

const orderDetail = sequelize.define(
  "order_detail",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "order",
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "menu",
        type: "id",
      },
    },
    store_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "store",
        key: "id",
      },
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    proceed: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    is_seen: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
  }
);

async function insertOrderDetail(order_id, product_id, quantity, store_id, price) {
  try {
    await orderDetail.create({
      order_id: order_id,
      product_id: product_id,
      quantity: quantity,
      store_id: store_id,
      price: price,
      proceed: 0,
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getProductListWithOrderId(order_id, store_id) {
  try {
    const data = await sequelize.query("select product_id,(select name from menu m where od.product_id = m.id) 'name' from order_detail od where order_id = '" + order_id + "' and store_id = '" + store_id + "'", {
      type: QueryTypes.SELECT,
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getOrderDetailById(order_id) {
  return await sequelize.query("select product_id, " + "(select name from menu m where od.product_id = m.id) 'product_name', store_id, " + "(select name from store s where od.store_id = s.id) 'store_name', quantity, price from order_detail od where od.order_id = '" + order_id + "'", {
    type: QueryTypes.SELECT,
  });
}

async function getAllOrderProductOfStore(store_id) {
  //hiển thị danh sách order của 1 store 
  const orderDetailProduct = await orderDetail.findAll({
    where: {
      store_id: store_id,
    }
  })

  let total = 0;
  const groupOrderbyOrderId = orderDetailProduct.reduce((result, item) => {
    // If the order_id key doesn't exist in the result, create it
    if (!result[item.order_id]) {
      result[item.order_id] = [];
    }
    total += (item.price * item.quantity)
    result[item.order_id].push(item)
    return result;
  }, {})
  return {
    ...groupOrderbyOrderId,
    total
  };
}

async function getTotalPriceByOrderId(order_id) {
  const data = await sequelize.query("select SUM(quantity * price) as 'total' from order_detail where order_id = '" + order_id + "'", {
    type: QueryTypes.SELECT,
  });
  if (data) return data[0].total;
}

async function checkproceedOrderDetail(order_id, product_id, store_id) {
  try {
    const data = await sequelize.query("select proceed from food_delivery.order_detail where order_id = '" + order_id + "' and product_id = '" + product_id + "' and store_id ='" + store_id + "'", {
      type: QueryTypes.SELECT,
    });
    return data[0].proceed;
  } catch (error) {
    return error;
  }
}

async function proceedOrderDetail(order_id, product_id, store_id) {
  try {
    await orderDetail.update(
      { proceed: 1 },
      {
        where: {
          order_id: order_id,
          product_id: product_id,
          store_id: store_id,
        },
      }
    );
    return true;
  } catch (error) {
    return error;
  }
}

async function orderSeenCheckWithStore(order_id, product_id, store_id) {
  try {
    await orderDetail.update(
      { is_seen: 1 },
      {
        where: {
          order_id: order_id,
          product_id: product_id,
          store_id: store_id,
        },
      }
    );
    return true;
  } catch (error) {
    return false;
  }
}

async function getUnseenOrderFromStore(store_id) {
  try {
    const data = await sequelize.query("SELECT order_id, product_id FROM food_delivery.order_detail where store_id ='" + store_id + "' and is_seen = 0", {
      type: QueryTypes.SELECT,
    });
    return data;
  } catch (error) {
    return error;
  }
}

// async function deproceedOrderDetail(order_id, store_id, product_id) {
//   try {
//     await orderDetail.update(
//       { proceed: 0 },
//       {
//         where: {
//           order_id: order_id,
//           product_id: product_id,
//           store_id: store_id,
//         },
//       }
//     );
//     return true;
//   } catch (error) {
//     return false;
//   }
// }
async function getOrderProductsStore(order_id)
{
  try {
    const data = await sequelize.query(`select t.order_id, account_id, t.store_id, t.product_id, star, t2.created_date, t3.name 'store_name', comment, t4.name 'product_name'
from food_delivery.order_detail t left join food_delivery.comment t2
on t.store_id = t2.store_id and t.order_id = t2.order_id
join food_delivery.store t3 on t.store_id = t3.id
join food_delivery.menu t4 on t.product_id = t4.id
where t.order_id = '` + order_id + "'", {
      type: QueryTypes.SELECT,
    });
    return data;
  } catch (error) {
    return null;
  }
}



module.exports = {
  orderDetail,
  insertOrderDetail,
  checkproceedOrderDetail,
  proceedOrderDetail,
  //deproceedOrderDetail,
  orderSeenCheckWithStore,
  getUnseenOrderFromStore,
  getOrderDetailById,
  getTotalPriceByOrderId,
  getProductListWithOrderId,
  getAllOrderProductOfStore,
  getOrderProductsStore
};
