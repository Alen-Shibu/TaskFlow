import Task from '../models/task.model.js'; 

export const getTasks = async (req, res) => {
  try {
    let tasks;

    // 👑 Admin → get ALL tasks
    if (req.user.role === 'admin') {
      tasks = await Task.find();
    } 
    
    // 👤 Member → own + assigned tasks
    else {
      tasks = await Task.find({
        $or: [
          { userId: req.user.id },          // created by user
          { assignedTo: req.user.id }       // assigned to user
        ]
      });
    }

    res.status(200).json(tasks);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      userId: req.user.id,
    });

    res.status(201).json(task); // 201 = something was created
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      req.body,            
      { new: true }        
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { userId } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.assignedTo = userId;
    await task.save();

    res.json(task);

  } catch (error) {
    console.log("Error in assignTask", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};