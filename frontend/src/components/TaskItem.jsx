import React from 'react';
import { Trash2, CheckCircle, Circle, Clock, AlertTriangle } from 'lucide-react';


const TaskItem = ({ task, onUpdateStatus, onDelete }) => {
    const isCompleted = task.status === 'Completed';

    const priorityColors = {
        Low: 'text-blue-400 bg-blue-400/10',
        Medium: 'text-yellow-400 bg-yellow-400/10',
        High: 'text-red-400 bg-red-400/10'
    };

    return (
        <div className={`glass p-4 rounded-xl transition-all duration-300 border-l-4 ${isCompleted ? 'border-green-500 opacity-75' :
            task.priority === 'High' ? 'border-red-500' :
                task.priority === 'Medium' ? 'border-yellow-500' : 'border-blue-500'
            }`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-lg truncate ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className={`text-sm text-slate-400 mt-1 line-clamp-2 ${isCompleted ? 'line-through' : ''}`}>
                            {task.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                            {task.priority}
                        </span>

                        <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock size={12} />
                            {new Date(task.dueDate).toLocaleDateString()}
                        </span>

                        <span className={`text-xs flex items-center gap-1 ${isCompleted ? 'text-green-500' : 'text-slate-400'}`}>
                            {isCompleted ? <CheckCircle size={12} /> : <Circle size={12} />}
                            {task.status}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => onUpdateStatus(task._id, isCompleted ? 'Pending' : 'Completed')}
                        className={`p-2 rounded-lg transition-colors ${isCompleted ? 'text-green-500 hover:bg-green-500/10' : 'text-slate-400 hover:bg-slate-700'
                            }`}
                        title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
                    >
                        <CheckCircle size={20} />
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete Task"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
