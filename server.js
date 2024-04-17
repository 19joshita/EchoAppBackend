const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const path = require("path");
const authRoutes = require("./routes/authRoute");
//DOTENV
dotenv.config();
//MONGODB CONNENCTION
connectDB();
//REST OBJECT
const app = express();
// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
//MADDLEWARE
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        // allowedHeaders: ["Content-Type", "Authorization"],
        // exposedHeaders: ["Authorization"],
        // credentials: true,
    })
);
// app.use(express.json());
//ROUTE
app.use("/api/v1/auth", authRoutes);
//PORT
const PORT = process.env.PORT || 8080;
//LISTEN
app.listen(PORT, () => {
    console.log(`Server is Running ${PORT}`.bgBlue.white);
});
