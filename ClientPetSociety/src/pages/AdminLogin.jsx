import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';
import logo from '../assets/logo/logo.svg';
import eyeOpen from '../assets/icons/eye-open.png';
import eyeClose from '../assets/icons/eye-close.png';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  console.log('AdminLogin component rendering'); // Debug

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Limpiar error cuando el usuario empiece a escribir
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/admin/login/', {
        username: form.username,
        password: form.password
      });

      // Guardar tokens
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      
      // Guardar información del usuario admin
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
      
      // Redirigir al panel de administración
      navigate('/admin/panel');
      
    } catch (err) {
      console.error('Error en login de admin:', err);
      if (err.response) {
        setError(err.response.data.error || 'Error en la autenticación');
      } else {
        setError('Error de conexión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-bg">
      <div className="admin-login-container">
        <img 
          src={logo} 
          alt="Pet Society" 
          className="admin-login-logo" 
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        />
        <h2 className="admin-login-title">Administrador Login</h2>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Correo o usuario"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            required
            disabled={loading}
          />
          <div className="admin-login-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="admin-login-toggle-password-btn"
              onClick={handleShowPassword}
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              disabled={loading}
            >
              <img
                src={showPassword ? eyeOpen : eyeClose}
                alt={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="admin-login-eye-icon"
              />
            </button>
          </div>
          {error && <div className="admin-login-error">{error}</div>}
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 