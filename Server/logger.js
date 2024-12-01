const winston = require("winston");

// Create a logger instance
const logger = winston.createLogger({
  level: "info", // Minimum level to log
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamps to logs
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }), // Log to console
    new winston.transports.File({ filename: "logs/app.log", level: "info" }), // Log to a file
  ],
});


module.exports = logger;
