const { sequelize } = require("../services/common");
const { DataTypes, Op, QueryTypes } = require("sequelize");

const Comment = sequelize.define(
  "comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    store_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "store",
        key: "id",
      },
    },
    order_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "order",
        key: "id",
      },
    },
    account_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: "account",
        key: "id",
      },
    },
    comment: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.BLOB,
    },
    star: {
      type: DataTypes.INTEGER,
    },
    created_date: {
      type: DataTypes.STRING(25),
    },
    updated_date: {
      type: DataTypes.STRING(25),
    },
  },
  {
    timestamps: false,
    // created: false,
    // updatedAt: false,
  }
);

async function insertComment(store_id, order_id, account_id, comment, image, star, created_date, updated_date) {
  try {
    await Comment.create({
      store_id: store_id,
      order_id: order_id,
      account_id: account_id,
      comment: comment,
      image: image,
      star: star,
      created_date: created_date,
      updated_date: updated_date,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateComment(store_id, order_id, account_id, comment, star, updated_date) {
  try {
    await Comment.update(
      {
        store_id: store_id,
        order_id: order_id,
        account_id: account_id,
        comment: comment,
        star: star,
        updated_date: updated_date,
      },
      {
        where: {
          store_id: store_id,
          order_id: order_id,
          account_id: account_id,
        },
      }
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getCommentsListFromStore(store_id) {
  try {
    const data = await sequelize.query(
      "SELECT id , order_id, (select name from account a where a.id = c.account_id) 'name' " +
        ", comment, star, created_date, updated_date FROM food_delivery.comment c where c.store_id = '" +
        store_id +
        "'",
      {
        type: QueryTypes.SELECT,
      }
    );
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getCommetByIdAndAccount(account_id, comment_id) {
  return await Comment.findAll({
    where: {
      [Op.and]: [
        {
          account_id: {
            [Op.eq]: account_id,
          },
        },
        {
          id: {
            [Op.eq]: comment_id,
          },
        },
      ],
    },
  });
}

async function checkExistComment(account_id, order_id, store_id) {
  try {
    const data = await Comment.findOne({
      where: {
        account_id: account_id,
        order_id: order_id,
        store_id: store_id,
      },
    });
    if (data) return true;
    else return false;
  } catch (error) {}
}

module.exports = {
  Comment,
  insertComment,
  updateComment,
  getCommentsListFromStore,
  getCommetByIdAndAccount,
  checkExistComment,
};
