const router = require("express").Router();
const order = require("../controller/order_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");
const { PROPERTY_TYPE } = require("../services/constant");

router.route("/get-history/").get(middleware(schemas.getAccountOrders, PROPERTY_TYPE.query), order.getHistory);
router.post("/get-comment", order.orderComment);
router.post("/state", order.getOrderReceivedState);

router.route("/create").post(middleware(schemas.createOrder, PROPERTY_TYPE.body), order.createOrder);
router.route("/proceed").post(middleware(schemas.proceedOrderWithStore, PROPERTY_TYPE.body), order.proceedOrderWithStore);

router.route("/status-change").post(middleware(schemas.changeOrderStatus, PROPERTY_TYPE.body), order.changeOrderStatus);
router.route("/get-store-orders").post(middleware(schemas.getStoreOrders, PROPERTY_TYPE.query), order.getStoreOrders);
router.route("/get-order/:order_id").post(middleware(schemas.OrderId, PROPERTY_TYPE.params), order.getOrderDetail);
router.post("/orders-seen-status-set", order.orderSeenStatusSet);
router.post("/get-unseen-orders", order.getUnseenStatusOrder);

//test
router.get("/test", order.test);

module.exports = router;
