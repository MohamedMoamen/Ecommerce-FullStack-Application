import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('user'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint =
      role === 'admin'
        ? 'http://127.0.0.1:8000/api/admin/login'
        : role === 'delivery'
        ? 'http://127.0.0.1:8000/api/delivery/login'
        : 'http://127.0.0.1:8000/api/user/login';

    try {
      const res = await axios.post(endpoint, { email, password });
      
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('role', role);

      if (role === 'admin') navigate('/admin/home');
      else if (role === 'delivery') navigate('/delivery/home');
      else navigate('/user/home');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/user/register', { name, email, password });

      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('role', 'user');

      navigate('/user/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '300px' }}>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!isRegister ? (
          <form onSubmit={handleLogin}>
            <input 
              type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input 
              type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

            <select value={role} onChange={e => setRole(e.target.value)} required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="delivery">Delivery Member</option>
            </select>

            <button type="submit">Login</button>

            <p style={{marginTop:'10px'}}>
              Don't have an account? <span style={{color:'blue', cursor:'pointer'}} onClick={()=>setIsRegister(true)}>Register As User</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Register</button>
            <p style={{marginTop:'10px'}}>
              Already have an account? <span style={{color:'blue', cursor:'pointer'}} onClick={()=>setIsRegister(false)}>Login</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
