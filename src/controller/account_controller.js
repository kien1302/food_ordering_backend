const {
  insertAccount,
  getAccountByEmailAndRole,
  getAccountById,
  updateAccountPassword,
  getAccountPasswordById,
} = require("../models/account");
const bcrypt = require("bcryptjs");
const { getUserStore } = require("../models/store");

module.exports = {
  logoutAccount: async function (req, res) {
    try {
      await req.session.destroy();
      res.status(200).json("Logout successfully!");
    } catch (error) {
      res.status(404).json("Logout Failed!");
    }
  },

  registerAccount: async function (req, res) {
    try {
      const id = req.body.id;
      const role_id = req.body.role_id;
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const created_date = req.body.created_date;
      let hashedPassword = "";

      // Hash password
      bcrypt.genSalt(10, function (err, Salt) {
        bcrypt.hash(password, Salt, async function (err, hash) {
          if (err) {
            res.status(200).json({ message: "there is an error while register account" });
            return console.log("Cannot encrypt");
          }

          hashedPassword = hash;
          // Insert account into database
          const result = await insertAccount(id, role_id, name, email, hashedPassword, created_date);

          if (result) {
            res.status(200).json({ message: "Register successfully" });
          } else {
            res.status(404).json({ error: "This email is already exists" });
          }
        });
      });
    } catch (err) {
      res.status(404).send("Error");
    }
  },

  loginAccount: async function (req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const role_id = req.body.role_id;
      // Check if given account is exists
      let account = await getAccountByEmailAndRole(email, role_id);
      if (account === null) {
        res.status(500).json({ error: "This account does not exists" });
        return;
      }
      account = account[0];
      const hashedPassword = account.password;
      bcrypt.compare(password, hashedPassword, async function (err, isMatch) {
        if (err) {
          res.status(404).json({ error: err });
          return;
        }
        if (!isMatch) {
          res.status(404).json({ error: "Password is incorrect" });
          return;
        }
        //check user's role to return data
        if (account.role_id === "CUS") {
          res.status(200).json({
            message: "Login successfully!",
            userId: account.id,
            name: account.name,
            email: account.email,
            role: account.role_id,
          });
        } else {
          const store = await getUserStore(account.id);
          //console.log(store);
          if (store.length === 0) {
            //owner not yet created store
            sid = 0;
          } else {
            sid = store[0].id;
          }
          res.status(200).json({
            message: "Login successfully!",
            userId: account.id,
            name: account.name,
            email: account.email,
            role: account.role_id,
            storeId: sid,
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(404).send(err);
    }
  },

  getInformation: async function (req, res) {
    try {
      const userId = req.params.userId;

      const data = await getAccountById(userId);
      res.status(200).json(data);
    } catch (err) {
      res.status(404).json({ error: err });
    }
  },

  changePassword: async function (req, res) {
    try {
      const id = req.body.id;
      const oldpassword = req.body.oldpassword;
      const newpassword = req.body.newpassword;

      let saved_oldpassword = await getAccountPasswordById(id);
      //console.log(saved_oldpassword);
      saved_oldpassword = saved_oldpassword[0].password;
      bcrypt.compare(oldpassword, saved_oldpassword, async function (err, isMatch) {
        if (err) {
          res.status(404).json({ result: "fail", content: "Cannot hash 1" });
          return;
        }
        if (!isMatch) {
          res.status(404).json({ result: "fail", content: "Your current password is not matching" });
          return;
        } else {
          bcrypt.compare(newpassword, saved_oldpassword, async function (err, isMatch) {
            if (err) {
              res.status(404).json({ result: "fail", content: "Cannot hash 2" });
              return;
            }
            if (isMatch) {
              res.status(404).json({ result: "fail", content: "New password can not be same to old password" });
              return;
            } else {
              bcrypt.genSalt(10, function (err, Salt) {
                bcrypt.hash(newpassword, Salt, async function (err, hash) {
                  if (err) {
                    res.status(404).json({ result: "fail", content: "Cannot hash 3" });
                    return;
                  }
                  let newHashedPassword = hash;
                  const result = await updateAccountPassword(id, newHashedPassword);
                  if (result) {
                    res.status(200).json({ result: "success", content: "Change password successfully!" });
                    return;
                  } else {
                    res.status(404).json({ result: "fail", content: "Change password fail!" });
                    return;
                  }
                });
              });
            }
          });
        }
      });
    } catch (err) {
      res.status(404).json({ result: "fail", content: "Error" });
    }
  },
};
