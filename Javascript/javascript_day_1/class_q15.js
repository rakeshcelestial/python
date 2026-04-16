// =====================================
// TASK MANAGER CLASS
// =====================================
class TaskManager {
  // Private fields
  #tasks = [];
  #nextId = 1;

  // ==============================
  // ADD TASK
  // ==============================
  addTask(title, priority) {
    const task = {
      id: this.#nextId++,
      title,
      priority,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    this.#tasks.push(task);
  }

  // ==============================
  // COMPLETE TASK
  // ==============================
  completeTask(id) {
    const task = this.#tasks.find(t => t.id === id);

    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    task.status = "completed";
  }

  // ==============================
  // REMOVE TASK
  // ==============================
  removeTask(id) {
    const index = this.#tasks.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    this.#tasks.splice(index, 1);
  }

  // ==============================
  // GET TASKS
  // ==============================
  getTasks(filterStatus) {
    if (!filterStatus) {
      return [...this.#tasks]; // return copy
    }

    return this.#tasks.filter(t => t.status === filterStatus);
  }

  // ==============================
  // GETTER: TASK COUNT
  // ==============================
  get taskCount() {
    return this.#tasks.length;
  }

  // ==============================
  // STATIC METHOD: FROM JSON
  // ==============================
  static fromJSON(json) {
    const data = JSON.parse(json);

    const tm = new TaskManager();

    data.forEach(item => {
      tm.addTask(item.title, item.priority);
    });

    return tm;
  }
}


// =====================================
// TESTING
// =====================================
const tm = TaskManager.fromJSON(
  '[{"title":"Setup env","priority":"high"}]'
);

tm.addTask("Write tests", "medium");
tm.addTask("Deploy app", "low");

tm.completeTask(1);

// Total tasks
console.log(tm.taskCount);

// Pending tasks
console.log(tm.getTasks("pending"));

// All tasks
console.log(tm.getTasks());

// Error test
try {
  tm.removeTask(999);
} catch (e) {
  console.log("Error:", e.message);
}