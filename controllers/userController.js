const bcrypt = require("bcrypt");
const User = require("./../models/userModel");
const {
  registerSchema,
  loginSchema,
  updateUserSchema,
} = require("../validation/userValidation");
const { generateTokens } = require("../utils/tokengenerator");
const userModel = require("./../models/userModel");
require("dotenv").config();
const { expressjwt: jwt } = require("express-jwt");

// Registration
exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const { name, email, password } = value;
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(500)
        .send({ message: "Email already exists", status: false });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    // Save the user to the database
    await user.save();
    res
      .status(201)
      .send({ message: "User registered successfully", status: true });
  } catch (err) {
    return res.status(500).send({
      message: "error in login api",
      status: false,
      error,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: false });
    }
    const { email, password } = value;
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(500)
        .send({ message: "User Not Found!", status: false });
    }
    // Check the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(500)
        .send({ message: "Invalid Password", status: false });
    }
    user.password = undefined;
    // ****Create refresh token and access token ****//
    const { accessToken, refreshToken } = generateTokens(user._id);
    res.status(200).send({
      message: "Login Successfully",
      status: true,
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "error in login api",
      status: false,
      error,
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .send({ message: error.details[0].message, status: false });
    }
    const { name, email, password } = value;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({ message: "User not found", status: false });
    }
    console.log(user, "ssfasdfa");
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { name: name || user?.name, password: hashedPassword || user?.password },
      { new: true }
    );
    res.status(200).send({
      message: "Profile updated successfully Please Login",
      status: true,
      updatedUser,
    });
  } catch (error) {
    // Handle any errors that occur during the process

    return res.status(500).send({
      message: "An error occurred while updating the user",
      status: false,
      error: error.message,
    });
  }
};

// exports.updateUser = async (req, res) => {
//     try {
//         const { error, value } = updateUserSchema.validate(req.body);
//         if (error) {
//             return res
//                 .status(400)
//                 .send({ message: error.details[0].message, status: false });
//         }
//         const userId = req.params.id;
//         const { name, email, password } = value;

//         // Find the user by ID in the database
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(500).send({ message: "User not found", status: false });
//         }
//         if (name) {
//             user.name = name;
//         }

//         if (email) {
//             // Check if the new email is already in use by another user
//             const existingEmailUser = await User.findOne({ email });
//             if (existingEmailUser && existingEmailUser._id.toString() !== userId) {
//                 return res.status(400).send({
//                     message: "Email is already in use by another user",
//                     status: false,
//                 });
//             }
//             user.email = email;
//         }
//         if (password) {
//             user.password = await bcrypt.hash(password, 10);
//         }

//         // Save the updated user information
//         await user.save();

//         // Return a success response with the updated user details
//         res.status(200).send({
//             message: "Profile updated successfully",
//             status: true,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 // Include any other fields you want to return in the response
//             },
//         });
//     } catch (error) {
//         // Handle any errors that occur during the process
//         console.error("Error updating user:", error);
//         res.status(500).send({
//             message: "An error occurred while updating the user",
//             status: false,
//             error: error.message,
//         });
//     }
// };
