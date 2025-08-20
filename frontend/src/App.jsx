import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [alert, setAlert] = useState(null);

  const API_BASE = "http://127.0.0.1:5000"; 

  const fetchTasks = async () => {
    const response = await fetch(`${API_BASE}/api/tasks`);
    const data = await response.json();
    setTasks(data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      });
      if (response.ok) {
        setAlert({ type: "success", msg: "Task added successfully!" });
        setNewTask("");
        fetchTasks();
      }
    } catch (err) {
      setAlert({ type: "danger", msg: "Error adding task." });
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });
      setAlert({ type: "warning", msg: "Task deleted." });
      fetchTasks();
    } catch {
      setAlert({ type: "danger", msg: "Error deleting task." });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📋 Task Manager</h2>

      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.msg}
        </div>
      )}

      <form className="mb-3 d-flex" onSubmit={addTask}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Enter task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Add Task
        </button>
      </form>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Task</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
