const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const path = require("path");
const authRoutes = require('./routes/authRoute');
//DOTENV
dotenv.config();
//MONGODB CONNENCTION
connectDB();
//REST OBJECT
const app = express();
//MADDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

//ROUTE
app.use('/api/v1/auth', authRoutes);
//PORT
const PORT = process.env.PORT || 8080;
//LISTEN
app.listen(PORT, () => {
    console.log(`Server is Running ${PORT}`.bgBlue.white);
});
