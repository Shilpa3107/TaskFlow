import React from 'react';
import TaskItem from './TaskItem';
import { ListChecks } from 'lucide-react';

const TaskList = ({ tasks, onUpdateStatus, onDelete, loading }) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <p className="text-slate-400">Loading tasks...</p>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 glass rounded-2xl border-dashed border-2 border-slate-700">
                <ListChecks className="text-slate-600 mb-2" size={48} />
                <p className="text-slate-400">No tasks found. Add some to get started!</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {tasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    onUpdateStatus={onUpdateStatus}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default TaskList;
