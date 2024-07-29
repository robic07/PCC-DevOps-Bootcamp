const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db/connection.js");
const {
  createTasksCollection,
  getTasks,
  addTask,
  completeTask,
} = require("./db/db-logic.js");
const fs = require("fs");
const os = require("os");
const winston = require("winston");
const app = express();

// Configure Winston logger
const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  // Get the hostname
  const hostname = os.hostname();

  // Read the HTML file
  let html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

  // Replace the placeholder with the actual hostname
  html = html.replace(/{{hostname}}/g, hostname);

  // Send the modified HTML file
  res.send(html);
});

app.get("/client-side.js", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/client-side.js"));
});

// Post route for adding a new task
app.post("/addtask", async function (req, res, next) {
  try {
    addTask(req, res, next);
    logger.info(`Task "${req.body.newItem}" added successfully.`); // Log successful addition
  } catch (error) {
    console.error(error);
    logger.error(`Error adding task: ${error.message}`); // Log error details
    res.status(500).send("Error adding task");
  }
});

// Post route for removing a task
app.post("/completeTask", async function (req, res, next) {
  try {
    completeTask(req, res, next);
    logger.info(`Task with ID "${req.body}" completed.`); // Log task completion
  } catch (error) {
    console.error(error);
    logger.error(`Error completing task: ${req.body}`); // Log error details
    res.status(500).send("Error completing task");
  }
});

// Get route for displaying tasks
app.get("/getTodo", function (req, res) {
  try {
    getTasks(req, res);
  } catch (error) {
    console.error(error);
    logger.error(`Error retrieving tasks: ${error.message}`); // Log error details
    res.status(500).send("Error retrieving tasks");
  }
});

// Set app to listen on port 3000

app.listen(3000, async function () {
  try {
    logger.info("Server is running on port 3000."); // Log successful server start
  } catch (error) {
    logger.error(`Error starting server: ${error}`); // Log error details
  }
});
