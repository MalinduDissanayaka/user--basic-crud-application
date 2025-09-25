import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', age: '', location: '' });
  const [editId, setEditId] = useState(null);

  // Backend URL
  const API = 'http://localhost:5000/users';

  // READ: Load users
  useEffect(() => {
    axios.get(API).then(res => setUsers(res.data));
  }, []);

  // CREATE/UPDATE: Save form
  const saveUser = () => {
    if (editId) {
      // Update
      axios.put(`${API}/${editId}`, form).then(res => {
        setUsers(users.map(u => u._id === editId ? res.data : u));
        setEditId(null);
      });
    } else {
      // Create
      axios.post(API, form).then(res => setUsers([...users, res.data]));
    }
    setForm({ username: '', age: '', location: '' });
  };

  // DELETE: Remove user
  const deleteUser = (id) => {
    axios.delete(`${API}/${id}`).then(() => {
      setUsers(users.filter(u => u._id !== id));
    });
  };

  // Edit: Fill form
  const editUser = (user) => {
    setForm({ username: user.username, age: user.age, location: user.location });
    setEditId(user._id);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>User CRUD App</h1>
      
      {/* Form for Create/Update */}
      <div>
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <button onClick={saveUser}>{editId ? 'Update' : 'Add User'}</button>
      </div>

      {/* List Users */}
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.username} - Age: {user.age} - {user.location}
            <button onClick={() => editUser(user)}>Edit</button>
            <button onClick={() => deleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;