const { sequelize } = require("../services/common");
const { ProductType } = require("./product_type");
const { Store } = require("./store");
const { Menu } = require("./menu");
const { Order } = require("./order");
const { orderDetail } = require("./order_detail");
const { Comment } = require("./comment");
const { Account } = require("./account");

//console.clear();

sequelize
  .authenticate()
  .then(console.log("\nConnect database successfully"))
  .catch((err) => {
    console.log(err);
  });

// //Create association between models
// Menu.hasOne(ProductType, { foreignKey: "type_id", sourceKey: "id" });
// Menu.belongsTo(Store, { foreignKey: "store_id", sourceKey: "id" });
// Store.hasMany(Menu, { foreignKey: "store_id", sourceKey: "id" });
// ProductType.belongsTo(Menu, { foreignKey: "type_id", sourceKey: "id" });
// Order.hasOne(orderDetail, { foreignKey: "order_id", sourceKey: "id" });
// Store.hasMany(Order, { foreignKey: "store_id", sourceKey: "id" });

console.log("\nAssociation done!!\n");
