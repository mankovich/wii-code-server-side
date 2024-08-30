const express = require("express");
const allRoutes = require("./routes")
// const cors = require("cors");
const sequelize = require("./config/connection");

const app = express();
// app.use(cors());
const PORT = process.env.PORT || 3001;

// const { User } = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(allRoutes);
// rs


sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});