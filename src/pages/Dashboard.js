import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Button from "../components/Button";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const searchTimeout = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;

      const res = await api.get("/tasks", { params });
      setTasks(res.data.tasks);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  const loadStats = useCallback(async () => {
    try {
      const res = await api.get("/tasks/stats");
      setStats(res.data.stats);
    } catch {}
  }, []);

  useEffect(() => {
    loadTasks();
    loadStats();
  }, [loadTasks, loadStats]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(loadTasks, 300);
  };

  const handleCreateTask = async (data) => {
    try {
      setModalLoading(true);
      const res = await api.post("/tasks", data);
      setTasks((prev) => [res.data.task, ...prev]);
      await loadStats();
      setIsModalOpen(false);
      toast.success("Task created");
    } catch (e) {
      toast.error("Create failed");
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateTask = async (id, data) => {
    try {
      setModalLoading(true);
      const res = await api.put(`/tasks/${id}`, data);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data.task : t)));
      await loadStats();
      setEditingTask(null);
      setIsModalOpen(false);
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      await loadStats();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/tasks/${id}`, { status });
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data.task : t)));
      await loadStats();
    } catch {
      toast.error("Status update failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusCount = (s) => stats.byStatus?.[s] || 0;

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl">Welcome {user?.name}</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <input
        className="input mb-4"
        placeholder="Search tasks"
        value={searchTerm}
        onChange={handleSearch}
      />

      <Button onClick={() => setIsModalOpen(true)}>Add Task</Button>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={() => {
              setEditingTask(task);
              setIsModalOpen(true);
            }}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        loading={modalLoading}
      />
    </div>
  );
};

export default Dashboard;
