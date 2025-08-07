import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [sanctions, setSanctions] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedReport, setSelectedReport] = useState(null);
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8000/api';

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
      loadStats();
    } catch (error) {
      console.error('Error parsing admin user data:', error);
      navigate('/admin');
    }
  }, [navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats/`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUsers = async () => {
    if (users.length > 0) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setLoading(false);
  };

  const loadReports = async () => {
    if (reports.length > 0) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reportes/`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    }
    setLoading(false);
  };

  const loadSanctions = async () => {
    if (sanctions.length > 0) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/sanciones/`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setSanctions(data);
      }
    } catch (error) {
      console.error('Error loading sanctions:', error);
    }
    setLoading(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') {
      loadUsers();
    } else if (tab === 'reports') {
      loadReports();
    } else if (tab === 'sanctions') {
      loadSanctions();
    }
  };

  const handleApplySanction = async (sanctionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/apply-sanction/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          usuario_id: selectedUser.id,
          ...sanctionData
        })
      });
      
      if (response.ok) {
        alert('Sanción aplicada exitosamente');
        setShowSanctionModal(false);
        loadUsers();
        loadSanctions();
        loadStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error applying sanction:', error);
      alert('Error al aplicar la sanción');
    }
  };

  const handleResolveReport = async (reportId, action, eliminarPublicacion = false, notas = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reportes/${reportId}/resolve/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          accion: action,
          eliminar_publicacion: eliminarPublicacion,
          notas: notas || `Reporte ${action} por administrador`
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        loadReports();
        loadSanctions();
        loadStats();
        setSelectedReport(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error resolving report:', error);
      alert('Error al resolver el reporte');
    }
  };

  const handleRemoveSanction = async (sanctionId) => {
    if (!confirm('¿Estás seguro de que deseas remover esta sanción?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/sanciones/${sanctionId}/remove/`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        loadSanctions();
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error removing sanction:', error);
      alert('Error al remover la sanción');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  if (!adminUser) {
    return <div className="loading">Cargando...</div>;
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
      
      <div className="admin-nav">
        <nav className="admin-nav-content">
          <button 
            className={activeTab === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => handleTabChange('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'users' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => handleTabChange('users')}
          >
            Usuarios
          </button>
          <button 
            className={activeTab === 'reports' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => handleTabChange('reports')}
          >
            Reportes
          </button>
          <button 
            className={activeTab === 'sanctions' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => handleTabChange('sanctions')}
          >
            Sanciones
          </button>
        </nav>
      </div>
      
      <main className="admin-main">
        {activeTab === 'dashboard' && (
          <DashboardTab stats={stats} />
        )}
        
        {activeTab === 'users' && (
          <UsersTab 
            users={users} 
            loading={loading}
            onApplySanction={(user) => {
              setSelectedUser(user);
              setShowSanctionModal(true);
            }}
          />
        )}
        
        {activeTab === 'reports' && (
          <ReportsTab 
            reports={reports} 
            loading={loading}
            selectedReport={selectedReport}
            onSelectReport={setSelectedReport}
            onResolveReport={handleResolveReport}
          />
        )}
        
        {activeTab === 'sanctions' && (
          <SanctionsTab 
            sanctions={sanctions} 
            loading={loading}
            onRemoveSanction={handleRemoveSanction}
          />
        )}
      </main>
      
      {showSanctionModal && (
        <SanctionModal
          user={selectedUser}
          onClose={() => setShowSanctionModal(false)}
          onApply={handleApplySanction}
        />
      )}
    </div>
  );
};

const DashboardTab = ({ stats }) => (
  <div className="admin-content">
    <h2>Bienvenido al Panel de Administración</h2>
    <p>Aquí podrás gestionar usuarios, reportes y moderación del sistema.</p>
    
    <div className="admin-stats">
      <div className="stat-card">
        <h3>Usuarios</h3>
        <p>{stats.total_users || 0} registrados</p>
        <small>{stats.active_users || 0} activos</small>
      </div>
      <div className="stat-card">
        <h3>Publicaciones</h3>
        <p>{stats.total_publications || 0} publicaciones</p>
      </div>
      <div className="stat-card">
        <h3>Reportes</h3>
        <p>{stats.pending_reports || 0} pendientes</p>
        <small>{stats.total_reports || 0} total</small>
      </div>
      <div className="stat-card">
        <h3>Sanciones</h3>
        <p>{stats.total_sanctions || 0} activas</p>
      </div>
    </div>
  </div>
);

const UsersTab = ({ users, loading, onApplySanction }) => {
  if (loading) return <div className="loading">Cargando usuarios...</div>;
  
  return (
    <div className="admin-content">
      <h2>Gestión de Usuarios</h2>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Registro</th>
              <th>Publicaciones</th>
              <th>Reportes</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <strong>{user.username}</strong>
                    {user.perfil?.nombre && (
                      <small>{user.perfil.nombre} {user.perfil.apellido}</small>
                    )}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                <td>{user.total_publicaciones}</td>
                <td>{user.total_reportes}</td>
                <td>
                  <span className={`status ${user.is_active && user.perfil?.cuenta_activa ? 'active' : 'inactive'}`}>
                    {user.is_active && user.perfil?.cuenta_activa ? 'Activo' : 'Bloqueado'}
                  </span>
                  {user.ultima_sancion && (
                    <div className="sanction-info">
                      <small>{user.ultima_sancion.tipo_sancion}</small>
                    </div>
                  )}
                </td>
                <td>
                  {!user.is_staff && (
                    <button 
                      className="action-btn sanction"
                      onClick={() => onApplySanction(user)}
                    >
                      Sancionar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportsTab = ({ reports, loading, selectedReport, onSelectReport, onResolveReport }) => {
  if (loading) return <div className="loading">Cargando reportes...</div>;
  
  return (
    <div className="admin-content">
      <h2>Gestión de Reportes</h2>
      <div className="reports-container">
        <div className="reports-list">
          {reports.map(report => (
            <div 
              key={report.id} 
              className={`report-item ${selectedReport?.id === report.id ? 'selected' : ''}`}
              onClick={() => onSelectReport(report)}
            >
              <div className="report-header">
                <span className={`status ${report.estado}`}>{report.estado}</span>
                <small>{new Date(report.fecha_reporte).toLocaleDateString()}</small>
              </div>
              <p><strong>Reportado por:</strong> {report.usuario_reportante_username}</p>
              <p><strong>Motivo:</strong> {report.motivo.substring(0, 100)}...</p>
            </div>
          ))}
        </div>
        
        {selectedReport && (
          <ReportDetail 
            report={selectedReport} 
            onResolve={onResolveReport}
          />
        )}
      </div>
    </div>
  );
};

const ReportDetail = ({ report, onResolve }) => {
  const [notas, setNotas] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  
  const handleActionClick = (action, eliminarPublicacion = false) => {
    setPendingAction({ action, eliminarPublicacion });
    setShowNotesModal(true);
  };
  
  const executeAction = () => {
    if (pendingAction) {
      onResolve(report.id, pendingAction.action, pendingAction.eliminarPublicacion, notas);
      setShowNotesModal(false);
      setNotas('');
      setPendingAction(null);
    }
  };
  
  return (
    <div className="report-detail">
      <h3>Detalle del Reporte</h3>
      <div className="report-info">
        <p><strong>Estado:</strong> {report.estado}</p>
        <p><strong>Reportado por:</strong> {report.usuario_reportante_username}</p>
        <p><strong>Fecha:</strong> {new Date(report.fecha_reporte).toLocaleString()}</p>
        <p><strong>Motivo del reporte:</strong> {report.motivo}</p>
        
        {report.notas_moderador && (
          <p><strong>Notas del administrador:</strong> {report.notas_moderador}</p>
        )}
        
        {report.publicacion_reportada && (
          <div className="reported-publication">
            <h4>Publicación Reportada:</h4>
            <div className="publication-preview">
              <p><strong>Autor:</strong> {report.publicacion_reportada.usuario.username}</p>
              <p><strong>Contenido:</strong> {report.publicacion_reportada.descripcion}</p>
              <p><strong>Fecha:</strong> {new Date(report.publicacion_reportada.fecha_creacion).toLocaleString()}</p>
              {report.publicacion_reportada.imagen && (
                <img 
                  src={report.publicacion_reportada.imagen} 
                  alt="Publicación" 
                  className="publication-image"
                />
              )}
            </div>
          </div>
        )}
        
        {report.estado === 'pendiente' && (
          <div className="report-actions">
            <div className="action-help">
              <p><strong>Acciones disponibles:</strong></p>
              <ul>
                <li><strong>Resolver:</strong> Marca el reporte como válido y resuelto (la publicación permanece)</li>
                <li><strong>Resolver y Eliminar:</strong> Marca como resuelto y elimina la publicación ofensiva</li>
                <li><strong>Desestimar:</strong> Marca el reporte como no válido o sin fundamento</li>
              </ul>
            </div>
            <div className="action-buttons">
              <button 
                className="action-btn resolve"
                onClick={() => handleActionClick('resuelto', false)}
              >
                Resolver (Mantener Publicación)
              </button>
              <button 
                className="action-btn resolve delete"
                onClick={() => handleActionClick('resuelto', true)}
              >
                Resolver y Eliminar Publicación
              </button>
              <button 
                className="action-btn dismiss"
                onClick={() => handleActionClick('desestimado', false)}
              >
                Desestimar Reporte
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showNotesModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Agregar Notas de Moderación</h3>
            <div className="form-group">
              <label>Motivo de la decisión:</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Explica brevemente el motivo de tu decisión..."
                rows={4}
                required
              />
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowNotesModal(false)}>
                Cancelar
              </button>
              <button 
                type="button" 
                className="primary" 
                onClick={executeAction}
              >
                Confirmar Acción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SanctionsTab = ({ sanctions, loading, onRemoveSanction }) => {
  if (loading) return <div className="loading">Cargando sanciones...</div>;
  
  const getSanctionStatusBadge = (sanction) => {
    if (!sanction.activa) return <span className="status inactive">Removida</span>;
    
    if (sanction.tipo_sancion === 'suspension_temporal' && sanction.fecha_termino) {
      const now = new Date();
      const endDate = new Date(sanction.fecha_termino);
      if (now > endDate) {
        return <span className="status expired">Expirada</span>;
      }
    }
    
    return <span className="status active">Activa</span>;
  };

  const formatSanctionType = (tipo) => {
    const tipos = {
      'advertencia': 'Advertencia',
      'suspension_temporal': 'Suspensión Temporal',
      'suspension_permanente': 'Suspensión Permanente',
      'baneo': 'Baneo de la Plataforma'
    };
    return tipos[tipo] || tipo;
  };

  const formatEndDate = (fechaTermino) => {
    if (!fechaTermino) return 'Indefinido';
    return new Date(fechaTermino).toLocaleString();
  };

  const activeSanctions = sanctions.filter(s => s.activa);
  const inactiveSanctions = sanctions.filter(s => !s.activa);
  
  return (
    <div className="admin-content">
      <h2>Gestión de Sanciones</h2>
      
      <div className="sanctions-summary">
        <div className="summary-card">
          <h3>Sanciones Activas</h3>
          <p>{activeSanctions.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total de Sanciones</h3>
          <p>{sanctions.length}</p>
        </div>
      </div>

      <div className="sanctions-section">
        <h3>Sanciones Activas</h3>
        <div className="sanctions-table">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Tipo de Sanción</th>
                <th>Motivo</th>
                <th>Fecha Aplicada</th>
                <th>Fecha Término</th>
                <th>Moderador</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {activeSanctions.map(sanction => (
                <tr key={sanction.id}>
                  <td>
                    <div className="user-info">
                      <strong>{sanction.usuario_sancionado.username}</strong>
                    </div>
                  </td>
                  <td>
                    <span className={`sanction-type ${sanction.tipo_sancion}`}>
                      {formatSanctionType(sanction.tipo_sancion)}
                    </span>
                  </td>
                  <td>
                    <div className="motivo-cell" title={sanction.motivo}>
                      {sanction.motivo.length > 50 
                        ? sanction.motivo.substring(0, 50) + '...'
                        : sanction.motivo
                      }
                    </div>
                  </td>
                  <td>{new Date(sanction.fecha_sancion).toLocaleDateString()}</td>
                  <td>{formatEndDate(sanction.fecha_termino)}</td>
                  <td>{sanction.moderador_username}</td>
                  <td>{getSanctionStatusBadge(sanction)}</td>
                  <td>
                    {sanction.activa && (
                      <button 
                        className="action-btn remove"
                        onClick={() => onRemoveSanction(sanction.id)}
                      >
                        Remover
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {activeSanctions.length === 0 && (
          <div className="no-data">
            <p>No hay sanciones activas en el sistema.</p>
          </div>
        )}
      </div>

      {inactiveSanctions.length > 0 && (
        <div className="sanctions-section">
          <h3>Historial de Sanciones</h3>
          <div className="sanctions-table">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Tipo de Sanción</th>
                  <th>Motivo</th>
                  <th>Fecha Aplicada</th>
                  <th>Moderador</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {inactiveSanctions.slice(0, 10).map(sanction => (
                  <tr key={sanction.id} className="inactive-row">
                    <td>
                      <div className="user-info">
                        <strong>{sanction.usuario_sancionado.username}</strong>
                      </div>
                    </td>
                    <td>
                      <span className={`sanction-type ${sanction.tipo_sancion} inactive`}>
                        {formatSanctionType(sanction.tipo_sancion)}
                      </span>
                    </td>
                    <td>
                      <div className="motivo-cell" title={sanction.motivo}>
                        {sanction.motivo.length > 50 
                          ? sanction.motivo.substring(0, 50) + '...'
                          : sanction.motivo
                        }
                      </div>
                    </td>
                    <td>{new Date(sanction.fecha_sancion).toLocaleDateString()}</td>
                    <td>{sanction.moderador_username}</td>
                    <td>{getSanctionStatusBadge(sanction)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const SanctionModal = ({ user, onClose, onApply }) => {
  const [formData, setFormData] = useState({
    tipo_sancion: 'advertencia',
    motivo: '',
    fecha_termino: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.motivo.trim()) {
      alert('El motivo es requerido');
      return;
    }
    onApply(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Aplicar Sanción a {user.username}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo de Sanción:</label>
            <select 
              value={formData.tipo_sancion}
              onChange={(e) => setFormData({...formData, tipo_sancion: e.target.value})}
            >
              <option value="advertencia">Advertencia</option>
              <option value="suspension_temporal">Suspensión Temporal</option>
              <option value="suspension_permanente">Suspensión Permanente</option>
              <option value="baneo">Baneo de la Plataforma</option>
            </select>
          </div>
          
          {formData.tipo_sancion === 'suspension_temporal' && (
            <div className="form-group">
              <label>Fecha de Término:</label>
              <input 
                type="datetime-local"
                value={formData.fecha_termino}
                onChange={(e) => setFormData({...formData, fecha_termino: e.target.value})}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Motivo:</label>
            <textarea 
              value={formData.motivo}
              onChange={(e) => setFormData({...formData, motivo: e.target.value})}
              placeholder="Describe el motivo de la sanción..."
              rows={4}
              required
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="primary">Aplicar Sanción</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;