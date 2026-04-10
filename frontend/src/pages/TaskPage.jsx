import { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import useTaskStore from '../store/useTaskStore';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import './TaskPage.css';

function TaskPage() {
  const { user, logout } = useAuthStore();
  const { tasks, fetchTasks, isLoading } = useTaskStore();

  const [showModal, setShowModal] = useState(false);  
  const [editTask, setEditTask] = useState(null);     
  const [filter, setFilter] = useState('all');


  useEffect(() => {
    fetchTasks();
  }, []);

 
  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === filter);

  const handleEdit = (task) => {
    setEditTask(task);   
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditTask(null);   
    setShowModal(true);
  };

  return (
    <div className="taskpage">

      {/* Top navbar */}
      <header className="taskpage-header">
        <h2>My Tasks</h2>
        <div className="header-right">
          <span className="user-name">Hi, {user?.name}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Filter tabs + add button */}
      <div className="taskpage-toolbar">
        <div className="filter-tabs">
          {['all', 'todo', 'in-progress', 'done'].map((tab) => (
            <button
              key={tab}
              className={`tab ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="btn-primary" onClick={handleAddNew}>+ New Task</button>
      </div>

      {/* Task list */}
      <div className="task-list">
        {isLoading && <p className="empty-msg">Loading...</p>}

        {!isLoading && filteredTasks.length === 0 && (
          <p className="empty-msg">No tasks here. Add one!</p>
        )}

        {filteredTasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={handleEdit} />
        ))}
      </div>

      {/* Modal for create / edit */}
      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default TaskPage;