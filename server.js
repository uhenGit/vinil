const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const app = express();
const user = require("./routes/userRoute");
const item = require("./routes/itemRoute");
const url = config.get("atlas.url");

app.use(express.json());
app.use("/user", user);
app.use("/item", item);
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

app.listen(process.env.PORT || 4000, () => console.log("server started"));
