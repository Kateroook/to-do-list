import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

export default function CreateTask({ addTask }) {
    const [task, setTask] = useState({
        name: "",
        id: "",
        status: "todo",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!task.name) return toast("Task name is required");
        if (task.name.length < 3) return toast("Task name must be at least 3 characters");
        if (task.name.length > 20) return toast("Task name must be less than 20 characters");

        const newTask = { ...task, id: uuidv4() };
        addTask(newTask); // Emit the new task to the server

        setTask({
            name: "",
            id: "",
            status: "todo",
        });

        toast.success("Task created successfully");
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input
                onChange={(e) => setTask({ ...task, name: e.target.value })}
                type="text"
                value={task.name}
                style={{
                    border: "2px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    width: "200px",
                }}
                placeholder="Enter task name"
            />
            <button
                type="submit"
                style={{
                    backgroundColor: "#4a90e2",
                    color: "white",
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                }}
            >
                Create
            </button>
        </form>
    );
}
