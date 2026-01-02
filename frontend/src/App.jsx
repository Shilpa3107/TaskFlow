import React, { useState, useEffect, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Layout, Filter, ListFilter, SortAsc } from 'lucide-react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate', 'priority', 'createdAt'

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data } = await fetchTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    const { data } = await createTask(taskData);
    setTasks([data, ...tasks]);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const { data } = await updateTask(id, { status });
      setTasks(tasks.map(t => t._id === id ? data : t));
      toast.success(`Task marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter
    if (filterStatus !== 'All') {
      result = result.filter(t => t.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority') {
        const pMap = { High: 0, Medium: 1, Low: 2 };
        return pMap[a.priority] - pMap[b.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return result;
  }, [tasks, filterStatus, sortBy]);

  return (
    <div className="min-h-screen pb-20">
      <Toaster position="bottom-right" />

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 py-4 mb-8 backdrop-blur-md bg-opacity-80">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Layout className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sidebar / Form */}
          <div className="lg:col-span-4 space-y-6">
            <TaskForm onTaskAdded={handleAddTask} />

            <div className="glass p-4 rounded-2xl space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-slate-300">
                <Filter size={18} /> Quick Filters
              </h3>
              <div className="flex flex-wrap gap-2">
                {['All', 'Pending', 'Completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filterStatus === status
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <h3 className="font-semibold flex items-center gap-2 text-slate-300 pt-2">
                <SortAsc size={18} /> Sort By
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field text-sm"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="createdAt">Newest First</option>
              </select>
            </div>

            <div className="hidden lg:block glass p-6 rounded-2xl bg-gradient-to-br from-primary-600/20 to-transparent border-primary-500/20">
              <h4 className="font-bold text-primary-400">Pro Tip</h4>
              <p className="text-sm text-slate-400 mt-2">
                Use the priority flags to organize your day. High priority tasks should be tackled first!
              </p>
            </div>
          </div>

          {/* Task List Section */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ListFilter size={20} className="text-primary-500" />
                {filterStatus === 'All' ? 'Your Tasks' : `${filterStatus} Tasks`}
                <span className="text-sm font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full ml-2">
                  {filteredAndSortedTasks.length}
                </span>
              </h2>
            </div>

            <TaskList
              tasks={filteredAndSortedTasks}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteTask}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
