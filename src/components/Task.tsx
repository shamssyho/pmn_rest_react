import React, { useState, useEffect } from 'react';
import './Task.css';
import { Input, Stack, Button } from '@chakra-ui/react'
import axios from 'axios';

interface Task {
    id: number;
    todo: string;
    description: string;
    completed: boolean;
}

const Task: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<Task>({
        id: 0,
        todo: '',
        description: '',
        completed: false,
    });
    const [editTask, setEditTask] = useState<Task | null>(null);

    useEffect(() => {
        axios.get('https://dummyjson.com/todos')
            .then(response => {
                setTasks(response.data.todos);
            })
            .catch(error => {
                console.error('Erreur de requête :', error);
            });
    }, []);

    const addTask = async (): Promise<void> => {
        try {
            if (editTask) {
                await axios.put(`https://dummyjson.com/todos/${editTask.id}`, editTask);
                setTasks(tasks.map(task => (task.id === editTask.id ? editTask : task)));
                setEditTask(null);
            } else {
                const response = await axios.post('https://dummyjson.com/todos', newTask);
                setTasks([...tasks, response.data]);
            }

            setNewTask({
                id: 0,
                todo: '',
                description: '',
                completed: false,
            });
        } catch (error) {
            console.error('Erreur lors de l\'ajout ou de la mise à jour de la tâche :', error);
        }
    };

    const completeTask = async (taskId: number): Promise<void> => {
        try {
            const updatedTasks = tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            );
            setTasks(updatedTasks);
            await axios.put(`https://dummyjson.com/todos/${taskId}`, { completed: !tasks.find(task => task.id === taskId)?.completed });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la tâche :', error);
        }
    };

    const deleteTask = async (taskId: number): Promise<void> => {
        try {
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            setTasks(updatedTasks);

            await axios.delete(`https://dummyjson.com/todos/${taskId}`);
        } catch (error) {
            console.error('Erreur lors de la suppression de la tâche :', error);
        }
    };

    const editTaskHandler = (task: Task): void => {
        setEditTask(task);
        setNewTask({
            id: task.id,
            todo: task.todo,
            description: task.description,
            completed: task.completed,
        });
    };

    return (
        <>
            <div className='container'>
                <h1>Todo List</h1>

                <Stack spacing={8}>
                    {/* <Input placeholder='id' type='number' value={newTask.id} onChange={(e) => setNewTask({ ...newTask, id: Number(e.target.value) })} size='md' /> */}
                    <Input placeholder='Task' type="text" value={newTask.todo} onChange={(e) => setNewTask({ ...newTask, todo: e.target.value })} size='md' />
                    <Input placeholder='Description' type="text" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} size='md' />
                    <div>
                        <label>Completed:</label>
                        <input
                            type="checkbox"
                            checked={newTask.completed}
                            onChange={(e) => setNewTask({ ...newTask, completed: e.target.checked })}
                        />
                    </div>
                    <Button colorScheme='blue' onClick={addTask}>
                        {editTask ? 'Mettre à jour' : 'Ajouter à la liste'}
                    </Button>
                </Stack>

                <ul>
                    {tasks.map(task => (
                        <li key={task.id} className={task.completed ? 'completed' : ''}>
                            <h3 className='item'>{task.id}. {task.todo}</h3>
                            <p className='item'>{task.description}</p>
                            <div className='buttons'>
                                <button onClick={() => completeTask(task.id)}>
                                    {task.completed ? 'True' : 'False'}
                                </button>
                                <button onClick={() => deleteTask(task.id)}>Supprimer</button>
                                <button onClick={() => editTaskHandler(task)}>Modifier</button>
                                {/* <EditIcon color="black" onClick={() => editTaskHandler(task)} />
                                <CloseIcon color="black" onClick={() => deleteTask(task.id)} /> */}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Task;
