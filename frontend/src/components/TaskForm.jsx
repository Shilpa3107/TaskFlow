import React, { useState, useEffect } from 'react';
import { PlusCircle, Calendar, Flag } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskForm = ({ onTaskAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        status: 'Pending'
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        let newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Real-time validation clear
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onTaskAdded(formData);
            setFormData({
                title: '',
                description: '',
                priority: 'Medium',
                dueDate: '',
                status: 'Pending'
            });
            toast.success('Task added successfully!');
        } catch (error) {
            toast.error('Failed to add task');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.title.trim() && formData.dueDate;

    return (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <PlusCircle className="text-primary-500" /> Add New Task
            </h2>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-400">Task Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="What needs to be done?"
                    className={`input-field ${errors.title ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-400">Description (Optional)</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add details..."
                    className="input-field min-h-[80px]"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-1">
                        <Flag size={14} /> Priority
                    </label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-1">
                        <Calendar size={14} /> Due Date *
                    </label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className={`input-field ${errors.dueDate ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                    />
                    {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate}</p>}
                </div>
            </div>

            <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="btn-primary w-full mt-4 flex justify-center items-center gap-2"
            >
                {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
        </form>
    );
};

export default TaskForm;
