const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const logger = require("../logger");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  try {
    const listOfPosts = await Posts.findAll({ include: [Likes] });
    const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
    logger.info(`Posts retrieved successfully for user ID: ${req.user.id}`);
    res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
  } catch (error) {
    logger.error(`Error retrieving posts: ${error.message}`);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving posts." });
  }
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Posts.findByPk(id);
    logger.info(`Post retrieved successfully with ID: ${id}`);
    res.json(post);
  } catch (error) {
    logger.error(`Error retrieving post with ID ${id}: ${error.message}`);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the post." });
  }
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const listOfPosts = await Posts.findAll({
      where: { UserId: id },
      include: [Likes],
    });
    logger.info(`Posts retrieved successfully for user ID: ${id}`);
    res.json(listOfPosts);
  } catch (error) {
    logger.error(`Error retrieving posts for user ID ${id}: ${error.message}`);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving posts." });
  }
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;

  try {
    post.username = req.user.username;
    post.UserId = req.user.id;
    await Posts.create(post);
    logger.info(`Post created successfully by user ID: ${req.user.id}`);
    res.json(post);
  } catch (error) {
    logger.error(
      `Error creating post for user ID ${req.user.id}: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
});

router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  try {
    await Posts.update({ title: newTitle }, { where: { id: id } });
    logger.info(`Post title updated successfully for post ID: ${id}`);
    res.json(newTitle);
  } catch (error) {
    logger.error(
      `Error updating post title for post ID ${id}: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "An error occurred while updating the post title." });
  }
});

router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  try {
    await Posts.update({ postText: newText }, { where: { id: id } });
    logger.info(`Post text updated successfully for post ID: ${id}`);

    res.json(newText);
  } catch (error) {
    logger.error(
      `Error updating post text for post ID ${id}: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "An error occurred while updating the post text." });
  }
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  try {
    await Posts.destroy({
      where: {
        id: postId,
      },
    });
    res.json("DELETED SUCCESSFULLY");
  } catch (error) {
    logger.error(`Error deleting post with ID ${postId}: ${error.message}`);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the post." });
  }
});

module.exports = router;
