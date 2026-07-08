'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';


export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

     try {
    const formDataBody = new URLSearchParams();
    formDataBody.append('username', formData.email); 
    formDataBody.append('password', formData.password);

    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: formDataBody,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Login failed');

    localStorage.setItem('token', data.access_token);

    router.push('/dashboard'); 

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className= {styles.div1}>
      <div className={styles.div2}>

        <h2 className={styles.signin}>Sign In</h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.submitForm}>

          <div>
            <label className={styles.email}>Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className={styles.emailHolder} placeholder="johndoe@gmail.com" />
          </div>

          <div>
            <label className={styles.password}>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className={styles.passwordHolder} placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className={styles.loginbtn}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <p className={styles.noAccount}>
          Don't have an account? <a href="/register" className={styles.register}>Register</a>
        </p>
      </div>
    </div>
  );
}

 

