'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/view_task');
      if (!response.ok) throw new Error('Failed to load tasks');
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const taskPayload = {
      title: newTitle,
      description: newDesc,
      status: 'pending',
      user_id: 1
    };

    try {
      const response = await fetch('http://localhost:8000/add_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload),
      });

      if (response.ok) {
        fetchTasks(); 
        setNewTitle('');
        setNewDesc('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (task) => {
    const [id, title, description, currentStatus, user_id] = task;
    const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending';

    try {
      const response = await fetch(`http://localhost:8000/edit/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          status: nextStatus,
          user_id
        }),
      });

      if (response.ok) fetchTasks(); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/remove/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className={styles.div1}>

      <div className={styles.tasks}>
        <h1 style ={{marginLeft:'90px', fontSize: '45px', marginBottom:'20px'}}>My To-Do  List</h1>
        <button onClick={handleLogout} className={styles.logoutbtn}>Log Out</button>
      </div>

      
      <form onSubmit={handleAddTask} className={styles.form}>
        <h3 style={{fontSize:'23px'}}>Create New Task</h3>
        <input type="text" placeholder="Task Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required style={{ padding:'10px', height: '60px', fontSize: '12px' }} />
        <textarea placeholder="Task Description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} style={{ padding: '10px', height: '60px', fontSize: '12px' }} />
        <button type="submit" className={styles.submitbtn} >Add Task</button>
      </form>

      <h2>Your Tasks</h2>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found. Create one above!</p>
      ) : (

        <div className={styles.yourTasks}>
          {tasks.map((task, index) => {
            const [id, title, description, status] = task;
            
            return (
              <div key={id || index} className={styles.taskDisplay}>
                <div>
                  <h4 style={{color: 'black'}}>{title}</h4>
                  <p style={{ color: '#666' }}>{description}</p>
                  <span style={{ fontSize: '12px', background: status === 'completed' ? '#a4e7b3' : '#f8be92', color: status === 'completed' ? '#155724' : '#333', padding: '3px 8px', borderRadius: '10px' }}>
                    {status}
                  </span>
                </div>
                
                <div className={styles.btns}>
                  <button onClick={() => handleToggleStatus(task)} className={styles.statusbtn}>
                    {status === 'pending' ? 'Complete' : 'Undo'}
                  </button>

                  <button 
                    onClick={() => handleDeleteTask(id)} className={styles.deletebtn}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
