const router = require("express").Router();
const store = require("../controller/store_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");

router.get("/id=:sid", store.getStore);
router.get("/get-all-stores", store.getAllStores);
router.get("/homepage", store.loadUserStore);
router.post("/comments", store.getStoreComments);
router.route("/profit").post(middleware(schemas.profitYear, PROPERTY_TYPE.body), store.profitYear);
router.post("/totalprofit", store.getTotalProfit);

router.route("/create/").post(middleware(schemas.createStore, PROPERTY_TYPE.body), store.createStore);
router.route("/edit/").post(middleware(schemas.editStore, PROPERTY_TYPE.body), store.editStore);
router.route("/get-all-type").get(store.getAllType);
router.post("/get-best-sold-products", store.getMostSoldProducts);

module.exports = router;
