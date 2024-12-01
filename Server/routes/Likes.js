const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { where } = require("sequelize");
const logger = require("../logger");


router.post("/", validateToken, async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;

  try {
    const found = await Likes.findOne({
      where: { PostId: PostId, UserId: UserId },
    });

    if (!found) {
      await Likes.create({ PostId: PostId, UserId: UserId });
      logger.info(`Like added: UserId ${UserId}, PostId ${PostId}`);
      res.json({ liked: true });
    } else {
      await Likes.destroy({
        where: {
          PostId: PostId,
          UserId: UserId,
        },
      });
      logger.info(`Like removed: UserId ${UserId}, PostId ${PostId}`);
      res.json({ liked: false });
    }
  } catch (error) {
    logger.error(
      `Error in liking/unliking: UserId ${UserId}, PostId ${PostId} - ${error.message}`
    );
    res
      .status(500)
      .json({ error: "An error occurred while processing the like action." });
  }
});

module.exports = router;
