const db = require("./connection.js");

// Function to create the tasks table (if not exists)
async function createTasksTable() {
  try {
    const sql = `CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL
      )`;
    await db.query(sql);
    console.log("Tasks table created");

    // Check if table is empty and insert dummy data only if it is
    await insertDummyDataIfEmpty();
  } catch (error) {
    console.error("Error creating tasks table:", error);
  }
}

// Function to insert dummy data only if table is empty (first run)
async function insertDummyDataIfEmpty() {
  try {
    // Check if table has any data
    const existingTasks = await db.query("SELECT COUNT(*) as count FROM tasks");
    const taskCount = existingTasks[0].count;

    if (taskCount === 0) {
      console.log("Table is empty. Inserting dummy data...");
      const tasks = [
        "Learn Node.js basics",
        "Build a simple web application",
        "Connect to a database",
      ];

      for (const task of tasks) {
        await db.query("INSERT INTO tasks (task, status) VALUES (?, ?)", [
          task,
          "pending",
        ]);
        console.log(`Task "${task}" inserted`);
      }
      console.log("Dummy data insertion completed");
    } else {
      console.log(`Table already has ${taskCount} tasks. Skipping dummy data insertion.`);
    }
  } catch (error) {
    console.error("Error checking/inserting dummy data:", error);
  }
}

// Function to retrieve tasks from database
async function getTasks() {
  try {
    const rows = await db.query("SELECT * FROM tasks");
    return rows;
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    throw error;
  }
}

// Function to add a task to the database
async function addTask(newTask) {
  try {
    await db.query("INSERT INTO tasks (task, status) VALUES (?, ?)", [
      newTask,
      "pending",
    ]);
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
}

// Function to remove a task from the database
async function completeTask(taskId) {
  try {
    await db.query('UPDATE tasks SET status = "complete" WHERE id = ?', [
      taskId,
    ]);
  } catch (error) {
    console.error("Error removing task:", error);
    throw error;
  }
}

module.exports = { createTasksTable, getTasks, addTask, completeTask };
