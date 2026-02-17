import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/Button';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger page load animation
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  useEffect(() => {
    loadTasks();
    loadStats();
  }, [statusFilter, priorityFilter, sortBy, sortOrder]);

  // Staggered animation delays for stats cards
  const getStatDelay = (index) => {
    return index * 100 + 300;
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;
      
      const res = await api.get('/tasks', { params });
      setTasks(res.data.tasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data.stats);
    } catch (error) {
      // Silently fail stats loading
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Debounce search
    setTimeout(() => {
      loadTasks();
    }, 300);
  };

  const handleCreateTask = async (taskData) => {
    try {
      setModalLoading(true);
      const res = await api.post('/tasks', taskData);
      setTasks(prev => [res.data.task, ...prev]);
      await loadStats();
      setIsModalOpen(false);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      setModalLoading(true);
      const res = await api.put(`/tasks/${taskId}`, taskData);
      setTasks(prev => prev.map(task => task._id === taskId ? res.data.task : task));
      await loadStats();
      setIsModalOpen(false);
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      await loadStats();
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(prev => prev.map(task => task._id === taskId ? res.data.task : task));
      await loadStats();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusCount = (status) => {
    return stats.byStatus?.[status] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center animate-bounce-in">
          <div className="loading-spinner mx-auto mb-4 w-12 h-12 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center py-6 transition-all duration-500 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="animate-fade-in-down">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Task Dashboard</h1>
              <p className="text-gray-600 flex items-center">
                Welcome back, 
                <span className="font-semibold text-primary-600 ml-1">{user?.name}</span>
                <span className="ml-2 w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
              </p>
            </div>
            <div className="flex space-x-3 animate-fade-in-up">
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Button>
              <Button
                variant="danger"
                onClick={handleLogout}
                className="transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: 'Total Tasks', 
              value: stats.total || 0, 
              icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', 
              color: 'primary', 
              bgColor: 'bg-primary-100', 
              iconColor: 'text-primary-600' 
            },
            { 
              title: 'Pending', 
              value: getStatusCount('pending'), 
              icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', 
              color: 'warning', 
              bgColor: 'bg-warning-100', 
              iconColor: 'text-warning-600' 
            },
            { 
              title: 'In Progress', 
              value: getStatusCount('in-progress'), 
              icon: 'M13 10V3L4 14h7v7l9-11h-7z', 
              color: 'primary', 
              bgColor: 'bg-primary-100', 
              iconColor: 'text-primary-600' 
            },
            { 
              title: 'Completed', 
              value: getStatusCount('completed'), 
              icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', 
              color: 'success', 
              bgColor: 'bg-success-100', 
              iconColor: 'text-success-600' 
            }
          ].map((stat, index) => (
            <div 
              key={stat.title}
              className={`stat-card animate-stat-rise transition-all duration-300 hover:shadow-xl`}
              style={{ animationDelay: `${getStatDelay(index)}ms` }}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor} transition-all duration-300 group-hover:scale-110`}>
                  <svg className={`w-6 h-6 ${stat.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary-600">
                    {stat.value}
                    {stat.value > 0 && stat.color === 'success' && (
                      <span className="ml-2 text-success-500">✓</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="input w-full md:w-80 pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {[
                { value: statusFilter, onChange: setStatusFilter, options: [
                  { value: '', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' }
                ]},
                { value: priorityFilter, onChange: setPriorityFilter, options: [
                  { value: '', label: 'All Priority' },
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' }
                ]},
                { value: sortBy, onChange: setSortBy, options: [
                  { value: 'createdAt', label: 'Date Created' },
                  { value: 'updatedAt', label: 'Last Updated' },
                  { value: 'priority', label: 'Priority' },
                  { value: 'status', label: 'Status' }
                ]},
                { value: sortOrder, onChange: setSortOrder, options: [
                  { value: 'desc', label: 'Descending' },
                  { value: 'asc', label: 'Ascending' }
                ]}
              ].map((select, index) => (
                <select
                  key={index}
                  value={select.value}
                  onChange={(e) => select.onChange(e.target.value)}
                  className="input transition-all duration-300 focus:ring-2 focus:ring-primary-500 hover:border-primary-300"
                >
                  {select.options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ))}
              
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Task
              </Button>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
          {tasks.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 transition-all duration-300 hover:border-primary-300 hover:shadow-md">
              <div className="animate-bounce-in">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks yet</h3>
                <p className="mt-2 text-gray-500">Get started by creating your first task.</p>
                <div className="mt-8">
                  <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Your First Task
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div 
                key={task._id}
                className="animate-card-pop-in"
                style={{ animationDelay: `${900 + (index * 100)}ms` }}
              >
                <TaskCard
                  task={task}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              </div>
            ))
          )}
        </div>
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        loading={modalLoading}
      />
    </div>
  );
};

export default Dashboard;