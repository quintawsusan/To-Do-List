"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TodoDashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUid = localStorage.getItem("userId");

    if (!storedUid || storedUid === "undefined" || storedUid === "null") {
      localStorage.removeItem("userId"); 
      router.push("/login"); 
    } else {
      setUserId(storedUid);
      fetchTasks(storedUid);
    }
  }, [router]);

  useEffect(() => {
    const storedUid = localStorage.getItem("userId");
    if (!storedUid) {
      router.push("/login");
    } else {
      setUserId(storedUid);
      fetchTasks(storedUid);
    }
  }, [router]);

  const fetchTasks = async (uid) => {
    try {
      const response = await fetch(`http://localhost:8000/view_task/${uid}`);
      if (!response.ok) throw new Error("Could not fetch your tasks");
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch("http://localhost:8000/add_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          status: "pending",
          user_id: parseInt(userId),
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");

      setNewTask({ title: "", description: "" });
      fetchTasks(userId);
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleTaskStatus = async (task) => {
    const nextStatus = task.status === "pending" ? "completed" : "pending";
    try {
      const response = await fetch("http://localhost:8000/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: task.id,
          title: task.title,
          description: task.description,
          status: nextStatus,
        }),
      });

      if (!response.ok) throw new Error("Failed to update task");
      fetchTasks(userId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/remove/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");
      fetchTasks(userId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Loading your workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800">My To-Do List</h1>
          <button
            onClick={handleLogout}
            className="rounded bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-200"
          >
            Log Out
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleAddTask}
          className="mb-8 rounded-lg bg-white p-6 shadow-sm space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-700">Add New Task</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Description (Optional)"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Create Task
          </button>
        </form>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Your Tasks
          </h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No tasks found. Add one above to get started!
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => toggleTaskStatus(task)}
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span
                        className={`block text-lg font-medium ${task.status === "completed" ? "text-gray-400 line-through" : "text-gray-800"}`}
                      >
                        {task.title}
                      </span>
                      {task.description && (
                        <p
                          className={`text-sm ${task.status === "completed" ? "text-gray-400 line-through" : "text-gray-500"}`}
                        >
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="rounded text-red-500 hover:text-red-700 p-2 font-medium text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
