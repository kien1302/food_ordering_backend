const { Role, insertDefaultRole } = require("../models/role");
const { StoreType } = require("../models/store_type");
const { ProductType } = require("../models/product_type");
const { Account } = require("../models/account");
const { Menu } = require("../models/menu");
const { Store } = require("../models/store");
const { Order } = require("../models/order");
const { Comment } = require("../models/comment");
const { orderDetail } = require("../models/order_detail");
const { Status, insertDefaultStatus } = require("../models/status");
const { sequelize } = require("../services/common");

module.exports = {
  Init: async function (req, res) {
    try {
      await sequelize.sync();
      await insertDefaultRole();
      await insertDefaultStatus();
      res.status(200).json("Create all table successfully");
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
};
