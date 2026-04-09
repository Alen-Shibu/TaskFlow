import useTaskStore from '../store/useTaskStore';
import './TaskCard.css';

// priority → color dot
const priorityColor = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
};

function TaskCard({ task, onEdit }) {
  const { deleteTask } = useTaskStore();

  return (
    <div className="task-card">
      <div className="task-card-left">
        {/* colored dot showing priority */}
        <span
          className="priority-dot"
          style={{ backgroundColor: priorityColor[task.priority] }}
        />
        <div className="task-info">
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-desc">{task.description}</p>
          )}
          <div className="task-meta">
            <span className={`status-badge ${task.status}`}>{task.status}</span>
            {task.dueDate && (
              <span className="due-date">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-card-actions">
        <button className="btn-edit" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn-delete" onClick={() => deleteTask(task._id)}>Delete</button>
      </div>
    </div>
  );
}

export default TaskCard;