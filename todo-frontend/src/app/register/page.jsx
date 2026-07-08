'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css'; 

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Registration failed');

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.div1}>
      <div className={styles.div2}>

        <h2 className={styles.createAccount}>Create Account</h2>
        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">{error}</div>}
        {success && <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-600">{success}</div>}

        <form onSubmit={handleSubmit} className={styles.submitForm}>

          <div>
            <label className={styles.fullName}>Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className={styles.nameHolder} placeholder="John Doe" />
          </div>

          <div>
            <label className={styles.email}>Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className={styles.emailHolder} placeholder="johndoe@gmail.com" />
          </div>

          <div>
            <label className={styles.password}>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className={styles.passwordHolder} placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className={styles.registerbtn}>
            {loading ? 'Creating account...' : 'Register'}
          </button>

        </form>
        <p className={styles.signbtn}>
          Already have an account? <a href="/login" className={styles.signin}>Sign In</a>
        </p>
      </div>
    </div>
  );
}
