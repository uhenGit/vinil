const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 50
  },
  price: {
    type: Number,
    required: true
  },
  itemPhoto: {
    type: String,
    required: true
  }
});
const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
