const { sequelize } = require("../services/common");
const { DataTypes, Op, QueryTypes } = require("sequelize");

const Account = sequelize.define(
  "account",
  {
    id: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      references: {
        model: "role",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(255),
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
    },
    active_date: {
      type: DataTypes.STRING(25),
    },
    phone: {
      type: DataTypes.STRING(15),
    },
    momo_check: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    del_flag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_date: {
      type: DataTypes.STRING(25),
    },
  },
  {
    timestamps: false,
  }
);

async function insertAccount(id, role_id, name, email, password, created_date) {
  try {
    await Account.create({
      id: id,
      role_id: role_id,
      name: name,
      email: email,
      password: password,
      del_flag: false,
      created_date,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getAccountByEmailAndRole(email, role_id) {
  try {
    const data = await Account.findAll({
      where: {
        [Op.and]: [
          {
            email: {
              [Op.eq]: email,
            },
          },
          {
            role_id: {
              [Op.eq]: role_id,
            },
          },
        ],
      },
    });
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

async function getAccountById(userId) {
  return await Account.findOne({
    where: {
      id: {
        [Op.eq]: userId,
      },
    },
  });
}

async function getAccountByIdAndRole(userId, role_id) {
  return await Account.findAll({
    attributes: ["email", "name"],
    where: {
      [Op.and]: [
        {
          id: {
            [Op.eq]: userId,
          },
        },
        {
          role_id: {
            [Op.eq]: role_id,
          },
        },
      ],
    },
  });
}

async function updateAccountPassword(id, password) {
  try {
    await Account.update(
      {
        password: password,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getAccountPasswordById(id) {
  try {
    const data = await sequelize.query("Select password from account where id = '" + id + "'", {
      type: QueryTypes.SELECT,
    });
    return data;
  } catch (err) {
    return false;
  }
}

module.exports = {
  Account,
  insertAccount,
  getAccountByEmailAndRole,
  getAccountById,
  getAccountByIdAndRole,
  updateAccountPassword,
  getAccountPasswordById,
};
