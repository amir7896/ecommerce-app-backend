const mongoose = require("mongoose");

const dbConnection = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Database connected successfully!");
    })
    .catch((err) => {
      console.log(`Datebase not connected , Error : ${err}`);
    });
};

module.exports = dbConnection;
