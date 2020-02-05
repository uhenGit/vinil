const express = require("express");
const multer = require("multer");
const router = express.Router();
const Item = require("../model/itemModel");
const auth = require("../auth/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
});

const filter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024
  },
  fileFilter: filter
});

//CREATE item
//POST PRIVATE
router.post("/add", auth, upload.single("itemPhoto"), (req, res) => {
  console.log(req.file);

  const { title, description, price } = req.body;
  const itemPhoto = req.file.path;
  const newItem = new Item({
    title,
    description,
    price,
    itemPhoto
  });
  newItem
    .save()
    .then(() => res.status(201).json(newItem))
    .catch(err =>
      res.status(400).json({
        message: "bad request",
        error: err
      })
    );
});
//GET ALL items
//GET PUBLIC
router.get("/", (req, res) => {
  Item.find()
    .then(items => res.json(items))
    .catch(err =>
      res.status(404).json({
        message: "no more items",
        error: err
      })
    );
});
//GET ONE item
//GET by ID PUBLIC
router.get("/:itemId", (req, res) => {
  Item.findById(req.params.itemId)
    .then(item => res.json(item))
    .catch(err =>
      res.status(404).json({
        message: "item does not exist",
        error: err
      })
    );
});
//UPDATE item
//PUT PRIVATE
router.put("/:itemId", auth, (req, res) => {
  // let data = {};
  // for (const key in req.body) {
  //   data[key] = req.body[key];
  // }
  Item.findByIdAndUpdate(req.params.itemId, { $set: req.body }, { new: true })
    .then(item => res.status(200).json(item))
    .catch(err =>
      res.status(404).json({
        message: "item does not found",
        error: err
      })
    );
});
//DELETE item
//DELETE PRIVATE
router.delete("/:itemId", auth, (req, res) => {
  Item.findByIdAndDelete(req.params.itemId)
    .then(item => {
      if (item) {
        res.json({ message: "deleted succesfully" });
      } else {
        res.json({ message: "item does not found" });
      }
    })
    .catch(err =>
      res.status(409).json({
        message: "bad request",
        error: err
      })
    );
});
module.exports = router;
