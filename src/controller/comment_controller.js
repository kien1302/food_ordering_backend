const { insertComment, updateComment, getCommetByIdAndAccount, checkExistComment } = require("../models/comment");
const { getOrderByAccount } = require("../models/order");

module.exports = {
  createComment: async function (req, res) {
    try {
      const account_id = req.body.account_id;
      const order_id = req.body.order_id;
      const store_id = req.body.store_id;
      const star = req.body.star;
      const comment = req.body.comment;
      const image = req.body.image || "";
      // check if account has order before comment
      const check = await getOrderByAccount(account_id, order_id);

      if (check === null || check === undefined) {
        res.status(200).json({ message: "Please order first!!" });
        return;
      } else if (check[0].status != "SUCCESS") {
        res.status(200).json({ message: "You haven't received the order yet!!" });
        return;
      } else {
        // Insert comment into database
        const createAt = new Date().toISOString();
        const result = await insertComment(store_id, order_id, account_id, comment, image, star, createAt, createAt);
        if (result) {
          res.status(200).json({ message: "Comment added, thanks you again!!" });
        }
      }
    } catch (err) {
      res.status(500).send("Error vai lon");
    }
  },

  checkComment: async function (req, res) {
    try {
      const account_id = req.body.account_id;
      const order_id = req.body.order_id;
      const store_id = req.body.store_id;

      const data = await checkExistComment(account_id, order_id, store_id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error vai lon");
    }
  },

  editComment: async function (req, res) {
    try {
      const account_id = req.body.account_id;
      const order_id = req.body.order_id;
      const store_id = req.body.store_id;
      const comment = req.body.comment;
      const star = req.body.star;
      const image = req.body.image || "";

      // Update comment into database
      const updateAt = new Date().toISOString();
      const result = await updateComment(store_id, order_id, account_id, comment, star, updateAt);

      if (result) {
        res.status(200).json({ message: "Comment editted!!" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
