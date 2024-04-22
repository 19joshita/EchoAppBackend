const postSchema = require("../validation/postValidation");
const postModel = require("./../models/postModel");
exports.createPostController = async (req, res) => {
  try {
    // Validate request body against Joi schema
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description } = value;
    const post = new postModel({
      title,
      description,
      postedBy: req.user.userId,
    });
    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Controller function to get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("postedBy", "_id, name")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Posts fetched successfully", status: true, posts });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
