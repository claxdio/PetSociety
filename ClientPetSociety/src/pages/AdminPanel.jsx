import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado como admin
    const adminUserData = localStorage.getItem('admin_user');
    const accessToken = localStorage.getItem('access');
    
    if (!adminUserData || !accessToken) {
      navigate('/admin');
      return;
    }

    try {
      const user = JSON.parse(adminUserData);
      if (!user.is_admin) {
        navigate('/admin');
        return;
      }
      setAdminUser(user);
    } catch (error) {
      console.error('Error parsing admin user data:', error);
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  if (!adminUser) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Panel de Administración</h1>
          <div className="admin-user-info">
            <span>Bienvenido, {adminUser.username}</span>
            <button onClick={handleLogout} className="admin-logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      
      <main className="admin-main">
        <div className="admin-content">
          <h2>Bienvenido al Panel de Administración</h2>
          <p>Esta es la página provisional del panel de administración.</p>
          <p>Aquí podrás gestionar usuarios, publicaciones y configuraciones del sistema.</p>
          
          <div className="admin-stats">
            <div className="stat-card">
              <h3>Usuarios</h3>
              <p>0 usuarios registrados</p>
            </div>
            <div className="stat-card">
              <h3>Publicaciones</h3>
              <p>0 publicaciones</p>
            </div>
            <div className="stat-card">
              <h3>Reportes</h3>
              <p>0 reportes pendientes</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;