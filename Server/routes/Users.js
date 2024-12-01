const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");
const logger = require("../logger");
const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 2, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts from this IP, please try again later.",

  // Custom handler to log the error
  handler: (req, res) => {
    const ip = req.ip; // Get the client's IP address
    const route = req.originalUrl; // Get the requested route
    const errorMessage = `Rate limit exceeded: IP ${ip} on route ${route}`;

    // Log the error using Winston
    logger.warn(errorMessage);

    return res.status(429).json({
      error: "Too many login attempts. Please try again later.",
    });
  },
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await Users.findOne({ where: { username } });
    if (existingUser) {
      logger.warn(
        `Registration failed: Username '${username}' is already taken.`
      );
      return res.status(400).json({ error: "Username is already taken." });
    }

    // Hash the password and create the user
    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        username: username,
        password: hash,
      });
      logger.info(`User created successfully: ${username}`);
      res.json("Success");
    });
  } catch (error) {
    logger.error(
      `Unexpected error while creating user ${username}: ${error.message}`
    );
  }
});

router.post("/login", limiter, async (req, res) => {
  const { username, password, captchaToken } = req.body;

  const secretKey = "6LdYg40qAAAAAPISin2xH7p_dZlUrXEEFhHngIjY";
  const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

  try {
    const captchaResponse = await axios.post(verifyURL);
    if (!captchaResponse.data.success) {
      logger.warn("CAPTCHA verification failed");
      return res.json({ error: "Failed CAPTCHA verification" });
    }
  } catch (error) {
    return res.json({ error: "CAPTCHA verification failed" });
  }

  try {
    const user = await Users.findOne({ where: { username: username } });

    if (!user) {
      logger.warn(`Login failed: User ${username} does not exist`);
      res.json({ error: "User Doesn't Exist" });
    } else {
      bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          logger.warn(`Login failed: Incorrect password for user ${username}`);
          res.json({ error: "Incorrect Username & Password" });
        } else {
          logger.info(`User ${username} logged in successfully`);
          const accessToken = sign(
            { username: user.username, id: user.id },
            "importantSecret"
          );
          res.json({ token: accessToken, username: username, id: user.id });
        }
      });
    }
  } catch (error) {
    return res.json({ error: "Try again in 1 Minute" });
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/info/:id", async (req, res) => {
  const id = req.params.id;

  const info = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  if (info) {
    logger.info(`User info retrieved successfully for user ID: ${id}`);
    res.json(info);
  } else {
    // Log when the user is not found
    logger.warn(`User not found for ID: ${id}`);
    res.status(404).json({ error: "User not found" });
  }
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await Users.findOne({
      where: { username: req.user.username },
    });

    if (!user) {
      logger.warn(
        `Password change failed: User ${req.user.username} not found.`
      );
      return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      logger.warn(
        `Password change failed for user ${req.user.username}: Wrong password entered.`
      );
      return res.status(400).json({ error: "Wrong Password Entered!" });
    }

    // bcrypt.compare(oldPassword, user.password).then(async (match) => {
    //   if (!match) {
    //     logger.warn(
    //       `Password change failed for user ${req.user.username}: Wrong password entered.`
    //     );

    //     res.json({ error: "Wrong Password Entered!" });
    //   }

    const hash = await bcrypt.hash(newPassword, 10);
    await Users.update(
      { password: hash },
      { where: { username: req.user.username } }
    );

    logger.info(`Password successfully changed for user ${req.user.username}`);
    res.json("SUCCESS");

    // bcrypt.hash(newPassword, 10).then((hash) => {
    //   Users.update(
    //     { password: hash },
    //     { where: { username: req.user.username } }
    //   );

    //   logger.info(
    //     `Password successfully changed for user ${req.user.username}`
    //   );

    //   res.json("SUCCESS");
    // });
  } catch (error) {
    logger.error(
      `Error occurred while changing password for user ${req.user.username}: ${error.message}`
    );
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

module.exports = router;
