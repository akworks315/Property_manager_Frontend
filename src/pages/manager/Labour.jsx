import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Badge } from '../../components';
import { today } from '../../utils';

const blank = { name: '', phone: '', dailyWage: '' };

export default function Labour() {
  const [list, setList] = useState([]);
  const [att, setAtt] = useState({});
  const [date, setDate] = useState(today());
  const [f, setF] = useState(blank);
  const [err, setErr] = useState('');

  const loadLabour = () => api('/manager/labour').then(setList);
  const loadAtt = () => api('/manager/attendance?date=' + date).then((rows) => {
    const m = {}; rows.forEach((a) => (m[a.labour] = a.status)); setAtt(m);
  });
  useEffect(() => { loadLabour(); }, []);
  useEffect(() => { loadAtt(); }, [date]);

  const run = async (fn, after) => { setErr(''); try { await fn(); after(); } catch (e) { setErr(e.message); } };
  const mark = (labourId, status) => run(() => api('/manager/attendance', 'POST', { labourId, date, status }), loadAtt);

  return (
    <>
      <h2>Agents & Attendance</h2>
      {err && <div className="err">{err}</div>}
      <form className="card" onSubmit={(e) => { e.preventDefault(); run(async () => { await api('/manager/labour', 'POST', f); setF(blank); }, loadLabour); }}>
        <b>Add agent</b>
        <div className="row" style={{ marginTop: 10 }}>
          <input placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
          <input placeholder="Phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <input type="number" placeholder="Daily wage" value={f.dailyWage} onChange={(e) => setF({ ...f, dailyWage: e.target.value })} />
          <button>Add</button>
        </div>
      </form>
      <div className="row"><label>Date <input type="date" value={date} max={today()} onChange={(e) => setDate(e.target.value)} /></label></div>
      <table>
        <thead><tr><th>Name</th><th>Phone</th><th>Wage</th><th>Status ({date})</th><th>Mark</th></tr></thead>
        <tbody>
          {list.map((l) => (
            <tr key={l._id}>
              <td>{l.name}</td><td>{l.phone || '-'}</td><td>{l.dailyWage || '-'}</td>
              <td>{att[l._id] ? <Badge status={att[l._id]} /> : <span className="muted">Not marked</span>}</td>
              <td>
                <button className="small ok" onClick={() => mark(l._id, 'present')}>Present</button>
                <button className="small danger" onClick={() => mark(l._id, 'absent')}>Absent</button>
                <button className="small secondary" onClick={() => confirm('Remove this agent?') && run(() => api('/manager/labour/' + l._id, 'DELETE'), loadLabour)}>Remove</button>
              </td>
            </tr>
          ))}
          {!list.length && <tr><td colSpan="5">No agents added yet</td></tr>}
        </tbody>
      </table>
    </>
  );
}
