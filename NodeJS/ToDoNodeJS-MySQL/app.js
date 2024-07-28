const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db/connection.js");
const {
  createTasksTable,
  getTasks,
  addTask,
  completeTask,
} = require("./db/db-logic.js");
const winston = require("winston"); // Import Winston library

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
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/client-side.js", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/client-side.js"));
});

// Post route for adding a new task
app.post("/addtask", async function (req, res) {
  const newTask = req.body.newItem;
  try {
    await addTask(newTask);
    logger.info(`Task "${newTask}" added successfully.`); // Log successful addition
    res.redirect("/");
  } catch (error) {
    logger.error(`Error adding task: ${error.message}`); // Log error details
    res.status(500).send("Error adding task");
  }
});

// Post route for removing a task
app.post("/completeTask", async function (req, res) {
  const tasks = req.body;
  try {
    if (typeof tasks === "string") {
      await completeTask(tasks);
      logger.info(`Task with ID "${tasks}" completed.`); // Log task completion
    } else if (Array.isArray(tasks)) {
      for (const taskId of tasks) {
        await completeTask(taskId);
        logger.info(`Task with ID "${taskId}" completed.`); // Log multiple completions
      }
    }
    res.redirect("/");
  } catch (error) {
    logger.error(`Error completing task: ${error.message}`); // Log error details
    res.status(500).send("Error completing task");
  }
});

// Get route for displaying tasks
app.get("/getTodo", async function (req, res) {
  try {
    const tasks = await getTasks();
    res.json(tasks);
  } catch (error) {
    logger.error(`Error retrieving tasks: ${error.message}`); // Log error details
    res.status(500).send("Error retrieving tasks");
  }
});

// Set app to listen on port 3000
app.listen(3000, async function () {
  try {
    // await db.query('DROP TABLE tasks');
    await createTasksTable();
    logger.info("Server is running on port 3000."); // Log successful server start
  } catch (error) {
    logger.error(`Error starting server: ${error}`); // Log error details
  }
});
