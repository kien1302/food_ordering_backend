const express = require("express");
const router = express.Router();
const app = require("../controller");
const account_route = require("./account_route");
const menu_route = require("./menu_route");
const store_route = require("./store_route");
const order_route = require("./order_route");
const comment_route = require("./comment_route");

router.get("/init", app.Init);
router.use("/account", account_route);
router.use("/menu", menu_route);
router.use("/store", store_route);
router.use("/order", order_route);
router.use("/comment", comment_route);

module.exports = router;
