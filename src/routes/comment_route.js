const router = require("express").Router();
const comment = require("../controller/comment_controller");
const middleware = require("../middleware");
const schemas = require("../middleware/schema");

router.route("/create").post(middleware(schemas.createComment, PROPERTY_TYPE.body), comment.createComment);
router.post("/check", comment.checkComment);
router.route("/edit").post(middleware(schemas.editComment, PROPERTY_TYPE.body), comment.editComment);

module.exports = router;
