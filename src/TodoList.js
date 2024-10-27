import { useState, useEffect } from 'react';
import CreateTask from './components/CreateTask';
import ListTask from './components/ListTask';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'react-hot-toast';
import io from 'socket.io-client';
import './App.css';

const socket = io("http://localhost:5000"); 

function TodoList() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        socket.on('loadTasks', (existingTasks) => {
            setTasks(existingTasks);
        });

        socket.on('updateTasks', (updatedTasks) => {
            setTasks(updatedTasks);
        });

        return () => {
            socket.off('loadTasks');
            socket.off('updateTasks');
        };
    }, []);

    const addTask = (task) => {
        socket.emit("addTask", task);
    };

    const updateTask = (updatedTask) => {
        socket.emit("updateTask", updatedTask);
    };

    const deleteTask = (taskId) => {
        socket.emit("deleteTask", taskId);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Toaster toastOptions={{ duration: 3000 }} />
            <div className="App">
                <h1 className="header">Todo List✨</h1>
                <p>Drag and drop tasks to change their status</p>
                <CreateTask tasks={tasks} addTask={addTask} />
                <div className="todo-container">
                    <ListTask
                        tasks={tasks}
                        updateTask={updateTask}
                        deleteTask={deleteTask}
                    />
                </div>
            </div>
        </DndProvider>
    );
}

export default TodoList;