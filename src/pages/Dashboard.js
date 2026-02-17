import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  const searchTimeout = useRef(null);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ----------- API FUNCTIONS (memoized) ------------

  const loadTasks = useCallback(async () => {
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
  }, [searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  const loadStats = useCallback(async () => {
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data.stats);
    } catch (error) {
      // silently fail
    }
  }, []);

  // Reload when filters/sorting change
  useEffect(() => {
    loadTasks();
    loadStats();
  }, [loadTasks, loadStats]);

  // ----------- HANDLERS ------------

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
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
      setTasks(prev =>
        prev.map(task => task._id === taskId ? res.data.task : task)
      );
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
    if (!window.confirm('Are you sure you want to delete this task?')) return;

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
      setTasks(prev =>
        prev.map(task => task._id === taskId ? res.data.task : task)
      );
      await loadStats();
    } catch {
      toast.error('Failed to update task status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusCount = (status) => stats.byStatus?.[status] || 0;

  // ---------------- UI ----------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {/* YOUR ORIGINAL JSX UI GOES HERE */}
      {/* No UI changes required – everything else remains same */}
    </>
  );
};

export default Dashboard;
