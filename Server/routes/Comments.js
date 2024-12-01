const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const logger = require("../logger");


router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await Comments.findAll({ where: { PostId: postId } });
    logger.info(`Comments retrieved successfully for PostId: ${postId}`);
    res.json(comments);
  } catch (error) {
    logger.error(
      `Error retrieving comments for PostId ${postId}: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "An error occurred while retrieving comments." });
  }
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;

  try {
    await Comments.create(comment);
    logger.info(
      `Comment created successfully by user ${username} for PostId: ${comment.PostId}`
    );
    res.json(comment);
  } catch (error) {
    logger.error(
      `Error creating comment by user ${username} for PostId ${comment.PostId}: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "An error occurred while creating the comment." });
  }
});

router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;

  try {
    await Comments.destroy({
      where: {
        id: commentId,
      },
    });
    logger.info(`Comment deleted successfully with ID: ${commentId}`);
    res.json("Deleted Successfully");
  } catch (error) {
    logger.error(
      `Error deleting comment with ID ${commentId}: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "An error occurred while deleting the comment." });
  }
});

module.exports = router;
