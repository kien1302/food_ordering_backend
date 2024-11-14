const { insertStore, getStoreById, getUserStore, updateStoreById, getAll } = require("../models/store");
const { getCommentsListFromStore } = require("../models/comment");
const { getProductListWithOrderId } = require("../models/order_detail");
const { getProductsByStore, getBestSoldProductsFromStore } = require("../models/menu");
const { getAllType } = require("../models/store_type");
const { calculateProfitWithYear, getTotalProfitAndQuantityByStatus } = require("../models/order");

module.exports = {
  getAllStores: async function (req, res) {
    try {
      const data = await getAll();
      if (data) {
        res.status(200).json(data);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  createStore: async function (req, res) {
    try {
      const id = req.body.id;
      const name = req.body.name;
      const address = req.body.address;
      const description = req.body.description;
      const image = req.body.image;
      const type_id = req.body.type_id;
      const created_date = req.body.created_date;
      const owner_id = req.body.owner_id;

      const result = await insertStore(id, owner_id, name, address, description, image, type_id, created_date);

      if (result) {
        res.status(200).json({ message: "Create store successfully" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  getStore: async function (req, res) {
    try {
      const sid = req.params.sid;
      console.log(sid);
      if (sid != null) {
        const store = await getStoreById(sid);
        const products = await getProductsByStore(sid);
        //console.log([f_store, f_products]);
        if (store && products) {
          res.status(200).json({ store, products });
        }
      } else {
        res.status(500).json("ID not found");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  loadUserStore: async function (req, res) {
    try {
      const owner_id = req.body.owner_id;
      if (owner_id != null) {
        const storelist = await getUserStore(owner_id);
        //console.log(storelist);
        if (storelist) {
          res.status(200).json({ storelist });
        } else if (storelist == null) {
          res.status(500).json("No store created yet");
        } else {
          res.status(500).json("User's ID is not belong to seller type");
        }
      } else {
        res.status(500).json("Please login!");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  editStore: async function (req, res) {
    try {
      const id = req.body.id;
      const owner_id = req.body.owner_id;
      const name = req.body.name;
      const address = req.body.address;
      const description = req.body.description;
      const type_id = req.body.type_id;
      const created_date = req.body.created_date;

      const result = await updateStoreById(id, owner_id, name, address, description, type_id, created_date);

      if (result) {
        res.status(200).json({ message: "Edit store successfully" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getStoreComments: async function (req, res) {
    try {
      const store_id = req.body.store_id;
      if (store_id === null) {
        res.status(200).json({ error: "Please input a store id" });
        return;
      } else {
        let comments = await getCommentsListFromStore(store_id);
        const order_id = comments[0].order_id;
        const productlist = await getProductListWithOrderId(order_id, store_id);
        comments[0]["products"] = productlist;
        res.status(200).json(comments);
      }
    } catch (err) {
      console.log("err");
      res.status(500).send(err);
    }
  },

  getAllType: async function (req, res) {
    try {
      const allType = await getAllType();
      res.status(200).json(allType);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  getTotalProfit: async function (req, res) {
    try {
      const store_id = req.body.store_id;
      const data = await getTotalProfitAndQuantityByStatus(store_id);
      if (data) {
        //Make "status" become key name for ea object
        const transformedKeyData = data.reduce((result, item) => {
          const { status, ...rest } = item;
          result[status] = rest;
          return result;
        }, {});
        res.status(200).json(transformedKeyData);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //Chart
  profitYear: async function (req, res) {
    try {
      const store_id = req.body.store_id;

      const year = req.body.year;

      if (store_id && year) {
        const data = await calculateProfitWithYear(store_id, year);

        if (data) {
          //Convert to array list with timestamps and value only
          let arraydata = [];

          for (const index in data) {
            arraydata.push([parseInt(data[index].otimestamp), data[index].total]);
          }

          // Find the minimum and maximum timestamps in the data array
          const minTimestamp = Math.min(...arraydata.map(([timestamp]) => timestamp));
          const maxTimestamp = Math.max(...arraydata.map(([timestamp]) => timestamp));

          // Create an array of all the dates in the month
          const startDate = new Date(minTimestamp);
          const endDate = new Date(maxTimestamp);
          const datesInMonth = [];
          for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            datesInMonth.push(new Date(date));
          }

          // Fill in missing dates with value 0
          const filledDaysData = [];
          for (const date of datesInMonth) {
            const timestamp = date.getTime();
            const existingData = arraydata.find(([ts]) => ts === timestamp);
            if (existingData) {
              filledDaysData.push(existingData);
            } else {
              filledDaysData.push([timestamp, 0]);
            }
          }

          if (filledDaysData.length > 1) {
            //Group them with "month" key
            const groupedData = {};

            filledDaysData.forEach(([timestamp, value]) => {
              const date = new Date(timestamp);
              const month = date.toLocaleString("default", { month: "short" });

              if (!groupedData[month]) {
                groupedData[month] = [];
              }

              groupedData[month].push([timestamp, value]);
            });
            res.status(200).json(groupedData);
          }
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getMostSoldProducts: async function (req, res) {
    try {
      const store_id = req.body.store_id;

      const data = await getBestSoldProductsFromStore(store_id);
      if (data) {
        res.status(200).json(data);
      } else res.status(404).json({ error: "Failed" });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
