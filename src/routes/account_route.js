const router = require("express").Router();
const account = require("../controller/account_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");
const { PROPERTY_TYPE } = require("../services/constant");

router.route("/login").post(middleware(schemas.loginAccount, PROPERTY_TYPE.body), account.loginAccount);
router.post("/logout", account.logoutAccount);
router.route("/register").post(middleware(schemas.registerAccount, PROPERTY_TYPE.body), account.registerAccount);
router.route("/get-information/:userId").get(middleware(schemas.userId, PROPERTY_TYPE.params), account.getInformation);
router.route("/change-password").post(middleware(schemas.changePassword, PROPERTY_TYPE.body), account.changePassword);

module.exports = router;
