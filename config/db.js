const mongoose = require("mongoose");
const colors = require("colors");
// require("dotenv").config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(
            `Connect to Server Successfully. ${mongoose.connection.host}`.bgCyan.white
        );
    } catch (error) {
        console.log(`Server is disconnected ${error}`.bgYellow.red);
    }
};
module.exports = connectDB;
