const db = require("./connection.js");
const Joi = require("joi");
const MUUID = require("uuid-mongodb");
const winston = require("winston");

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

const collection = "tasks";
const schema = Joi.object().keys({
  _id: Joi.string().required(),
  task: Joi.string(),
  status: Joi.string(),
});

// Function to insert dummy data (optional)
async function createTasksCollection() {
  const tasks = [
    "Learn Node.js basics",
    "Build a simple web application",
    "Connect to a database",
  ];

  for (const task of tasks) {
    const dataInput = {
      _id: MUUID.v4().toString(),
      task: task,
      status: "pending",
    };

    const value = schema.validate(dataInput);
    if (value.error) {
      const error = new Error("Invalid Input: " + value.error);
      error.status = 400;
      throw error;
    }
    const collection = await db.getDB().collection("tasks");
    await collection.insertOne(dataInput, (err, result) => {
      if (err) {
        const error = new Error("Failed to insert Document");
        error.status = 400;
        return error;
      } else
        return {
          result: result,
          document: result.ops[0],
          msg: "Successfully inserted Grades!!!",
          error: null,
        };
    });
  }
}

// Function to retrieve tasks from database
function getTasks(req, res) {
  db.getDB()
    .collection("tasks")
    .find({})
    .toArray((err, documents) => {
      if (err) return new Error(err);
      else {
        res.json(documents);
      }
    });
}

// Function to add a task to the database
async function addTask(req, res, next) {
  const newTask = req.body.newItem;
  const dataInput = {
    _id: MUUID.v4().toString(),
    task: newTask,
    status: "pending",
  };

  const value = schema.validate(dataInput);
  if (value.error) {
    const error = new Error("Invalid Input: " + value.error);
    error.status = 400;
    throw error;
  }
  const collection = await db.getDB().collection("tasks");
  await collection.insertOne(dataInput, (err, result) => {
    if (err) {
      const error = new Error("Failed to insert Document");
      error.status = 400;
      return error;
    } else
      res.json({
        result: result,
        document: result.ops[0],
        msg: "Successfully inserted New Task!!!",
        error: null,
      });
    return next();
  });
}

// Function to remove a task from the database
async function completeTask(req, res, next) {
  const tasks = req.body;

  // Early return for invalid data type
  if (typeof tasks !== "object" || !tasks.length) {
    return next(new Error("Invalid task data"));
  }
  try {
    const updatedTasks = await Promise.all(
      tasks.map(async (taskId) => {
        const result = await db
          .getDB()
          .collection(collection)
          .findOneAndUpdate(
            { _id: taskId },
            { $set: { status: "complete" } },
            { returnOriginal: false }
          );
        return result;
      })
    );
    res.json(updatedTasks);
    next();
  } catch (err) {
    logger.error("Error updating tasks:", err);
    next(err);
  }
}

db.connect((err) => {
  if (err) {
    logger.error("unable to connect to database");
    logger.error(err);
    process.exit(1);
  } else {
    // createTasksCollection();
    logger.info("DB Connected!");
  }
});

module.exports = { createTasksCollection, getTasks, addTask, completeTask };
