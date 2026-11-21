import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Toggle } from '../../components';

const blank = { name: '', email: '', password: '' };

export default function Managers() {
  const [list, setList] = useState([]);
  const [f, setF] = useState(blank);
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState('');
  const load = () => api('/admin/managers').then(setList);
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (editId) await api('/admin/managers/' + editId, 'PUT', f);
      else await api('/admin/managers', 'POST', f);
      setF(blank); setEditId(null); load();
    } catch (e) { setErr(e.message); }
  };
  const act = async (fn) => { try { await fn(); load(); } catch (e) { alert(e.message); } };
  const setActive = (m, on) => {
    setList((l) => l.map((x) => (x._id === m._id ? { ...x, status: on ? 'active' : 'inactive' } : x)));
    act(() => api(`/admin/managers/${m._id}/status`, 'PATCH', { status: on ? 'active' : 'inactive' }));
  };

  return (
    <>
      <h2>Managers</h2>
      <form className="card" onSubmit={submit}>
        <b>{editId ? 'Edit manager' : 'Create manager account'}</b>
        {err && <div className="err">{err}</div>}
        <div className="row" style={{ marginTop: 10 }}>
          <input placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
          <input type="text" placeholder={editId ? 'New password (optional)' : 'Password'} value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })} required={!editId} />
          <button>{editId ? 'Update' : 'Create'}</button>
          {editId && <button type="button" className="secondary" onClick={() => { setEditId(null); setF(blank); }}>Cancel</button>}
        </div>
      </form>
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Account</th><th>Actions</th></tr></thead>
        <tbody>
          {list.map((m) => (
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td><Toggle checked={m.status === 'active'} onChange={(on) => setActive(m, on)} label={m.status === 'active' ? 'Active' : 'Inactive'} /></td>
              <td>
                <button className="small" onClick={() => { setEditId(m._id); setF({ name: m.name, email: m.email, password: '' }); window.scrollTo(0, 0); }}>Edit</button>
                <button className="small danger" onClick={() => confirm('Delete this manager?') && act(() => api('/admin/managers/' + m._id, 'DELETE'))}>Delete</button>
              </td>
            </tr>
          ))}
          {!list.length && <tr><td colSpan="4">No managers yet</td></tr>}
        </tbody>
      </table>
    </>
  );
}
