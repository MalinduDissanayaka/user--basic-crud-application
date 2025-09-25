import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', age: '', location: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Backend URL
  const API = 'http://localhost:5000/users';

  // READ: Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API);
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // CREATE/UPDATE: Save form
  const saveUser = async () => {
    if (!form.username.trim() || !form.age || !form.location.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (editId) {
        // Update
        const response = await axios.put(`${API}/${editId}`, form);
        setUsers(users.map(u => u._id === editId ? response.data : u));
        setSuccess('User updated successfully!');
        setEditId(null);
      } else {
        // Create
        const response = await axios.post(API, form);
        setUsers([...users, response.data]);
        setSuccess('User added successfully!');
      }
      
      setForm({ username: '', age: '', location: '' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  // DELETE: Remove user
  const deleteUser = async (id, username) => {
    if (!window.confirm(`Are you sure you want to delete ${username}?`)) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API}/${id}`);
      setUsers(users.filter(u => u._id !== id));
      setSuccess('User deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Edit: Fill form
  const editUser = (user) => {
    setForm({ username: user.username, age: user.age, location: user.location });
    setEditId(user._id);
    setError('');
    setSuccess('');
  };

  // Cancel edit
  const cancelEdit = () => {
    setForm({ username: '', age: '', location: '' });
    setEditId(null);
    setError('');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">👥</span>
            User Management System
          </h1>
          <p className="app-subtitle">Manage your users with ease and efficiency</p>
        </div>
      </header>

      <main className="main-content">
        {/* Alert Messages */}
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            {success}
          </div>
        )}

        {/* Form Section */}
        <section className="form-section">
          <div className="form-container">
            <h2 className="section-title">
              {editId ? '✏️ Edit User' : '➕ Add New User'}
            </h2>
            
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="username" className="input-label">Username</label>
                <input
                  id="username"
                  className="form-input"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="age" className="input-label">Age</label>
                <input
                  id="age"
                  className="form-input"
                  placeholder="Enter age"
                  type="number"
                  min="1"
                  max="120"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="location" className="input-label">Location</label>
                <input
                  id="location"
                  className="form-input"
                  placeholder="Enter location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="btn btn-primary" 
                onClick={saveUser}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner">⟳</span>
                ) : (
                  <>
                    {editId ? '💾 Update User' : '➕ Add User'}
                  </>
                )}
              </button>
              
              {editId && (
                <button 
                  className="btn btn-secondary" 
                  onClick={cancelEdit}
                  disabled={loading}
                >
                  ✖️ Cancel
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Users List Section */}
        <section className="users-section">
          <div className="section-header">
            <h2 className="section-title">👤 Users List ({users.length})</h2>
            <button 
              className="btn btn-outline" 
              onClick={loadUsers}
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </div>
          
          {loading && users.length === 0 ? (
            <div className="loading-state">
              <span className="loading-spinner large">⟳</span>
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <h3>No users yet</h3>
              <p>Start by adding your first user above</p>
            </div>
          ) : (
            <div className="users-grid">
              {users.map(user => (
                <div key={user._id} className="user-card">
                  <div className="user-avatar">
                    <span className="avatar-text">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="user-info">
                    <h3 className="user-name">{user.username}</h3>
                    <div className="user-details">
                      <span className="user-detail">
                        <span className="detail-icon">🎂</span>
                        {user.age} years old
                      </span>
                      <span className="user-detail">
                        <span className="detail-icon">📍</span>
                        {user.location}
                      </span>
                    </div>
                  </div>
                  
                  <div className="user-actions">
                    <button 
                      className="btn btn-sm btn-edit" 
                      onClick={() => editUser(user)}
                      disabled={loading}
                      title="Edit user"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn btn-sm btn-delete" 
                      onClick={() => deleteUser(user._id, user.username)}
                      disabled={loading}
                      title="Delete user"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      
      {/* Footer */}
      <footer className="app-footer">
        <p>© 2025 User Management System - Built with React & Express</p>
      </footer>
    </div>
  );
}

export default App;