import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import toast from "react-hot-toast"; 
import io from 'socket.io-client';

const socket = io("http://localhost:5000");

export default function ListTask({ tasks, updateTask, deleteTask }) {
    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        setTaskList(tasks);
    }, [tasks]);

    const handleDrop = (item, targetStatus, targetIndex) => {
        setTaskList((prev) => {
            const movedTask = prev.find((task) => task.id === item.id);

            if (movedTask.status === targetStatus) {
                const updatedTasks = [...prev];
                const currentIndex = prev.findIndex((task) => task.id === item.id);
                updatedTasks.splice(currentIndex, 1); 
                updatedTasks.splice(targetIndex, 0, movedTask); 

                socket.emit('updateTaskOrder', updatedTasks);

                localStorage.setItem("tasks", JSON.stringify(updatedTasks));
                return updatedTasks;
            } else {
                const updatedTask = { ...movedTask, status: targetStatus };
                const updatedTasks = prev.map((task) =>
                    task.id === movedTask.id ? updatedTask : task
                );

                const currentIndex = prev.findIndex((task) => task.id === item.id);
                updatedTasks.splice(currentIndex, 1);
                updatedTasks.splice(targetIndex, 0, updatedTask); 

                socket.emit('updateTask', updatedTask);

                localStorage.setItem("tasks", JSON.stringify(updatedTasks));
                return updatedTasks;
            }
        });
    };

    const statuses = ["todo", "progress", "done"];

    return (
        <div className="todo-container">
            {statuses.map((status, index) => (
                <Section
                    status={status}
                    key={index}
                    tasks={taskList}
                    handleDrop={handleDrop}
                    deleteTask={deleteTask}
                />
            ))}
        </div>
    );
}

function Section({ status, tasks, handleDrop, deleteTask }) {
    const text = status === "todo" ? "To Do" : status === "progress" ? "In Progress" : "Done";
    const tasksToMap = tasks.filter((task) => task.status === status);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "task",
        drop: (item, monitor) => {
            const index = tasksToMap.length; 
            const targetIndex = tasksToMap.length - 1; 
            handleDrop(item, status, targetIndex); 
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div ref={drop} className={`column ${status}`} style={{ backgroundColor: isOver ? "#e0ffe0" : "" }}>
            <h2>{text}</h2>
            {tasksToMap.map((task, index) => (
                <Task task={task} deleteTask={deleteTask} key={task.id} index={index} />
            ))}
        </div>
    );
}

function Task({ task, deleteTask, index }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "task",
        item: { id: task.id, status: task.status, index },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className={`task ${isDragging ? "dragging" : ""}`}
            style={{
                backgroundColor: isDragging ? "#e0ffe0" : "#f5f5f5",
                border: isDragging ? "2px solid #4CAF50" : "1px solid #ddd",
                opacity: isDragging ? 0.7 : 1,
                transition: "background-color 0.2s, border 0.2s",
            }}
        >
            <span>{task.name}</span>
            <i 
                className="fas fa-trash delete-icon"
                onClick={() => 
                deleteTask(task.id)} style={{ marginLeft: "10px", cursor: "pointer" }}>           
                
            </i>
        </div>
    );
}
