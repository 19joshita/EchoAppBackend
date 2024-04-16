const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please add email"],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Please add password"],
            min: 6,
            max: 20,
        },
        confirmPassword: {
            type: String,
            required: [true, "Please confirm password"],
            // Custom validation function to check if the password matches
            validate: {
                validator: function (value) {
                    return value === this.password;
                },
                message: "Passwords do not match",
            },
        },
        role: {
            type: String,
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("User", userSchema);
