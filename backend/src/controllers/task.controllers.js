import Task from '../models/task.model.js'; // bring in the Task model so we can query the DB

// GET /api/tasks
// Returns all tasks belonging to the logged-in user
export const getTasks = async (req, res) => {
  try {
    // req.user.id comes from your auth middleware (decoded JWT)
    const tasks = await Task.find({ userId: req.user.id });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tasks
// Creates a new task for the logged-in user
export const createTask = async (req, res) => {
  try {
    // Pull the fields the user sent in the request body
    const { title, description, status, priority, dueDate } = req.body;

    // Create a new task in the DB, attaching the logged-in user's id
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      userId: req.user.id, // tie this task to the logged-in user
    });

    res.status(201).json(task); // 201 = something was created
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tasks/:id
// Returns a single task by its ID
export const getTaskById = async (req, res) => {
  try {
    // req.params.id is the :id from the URL
    // We also check userId so users can't read each other's tasks
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tasks/:id
// Updates a task — only sends back the updated version
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // find this task, owned by this user
      req.body,            // update it with whatever fields were sent
      { new: true }        // return the updated doc instead of the old one
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/tasks/:id
// Deletes a task by ID
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};