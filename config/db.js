const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connect to Server. ${mongoose.connection.host}`.bgCyan.white);
    } catch (error) {
        console.log(`error in connectDB ${error}`.bgYellow.red);
    }
};
module.exports = connectDB;