import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Badge, ManagerSelect } from '../../components';
import { today } from '../../utils';

export default function Labour() {
  const [manager, setManager] = useState('');
  const [date, setDate] = useState(today());
  const [labour, setLabour] = useState([]);
  const [att, setAtt] = useState([]);

  useEffect(() => {
    const m = manager ? 'manager=' + manager : '';
    api('/admin/labour' + (m ? '?' + m : '')).then(setLabour);
    api('/admin/attendance?date=' + date + (m ? '&' + m : '')).then(setAtt);
  }, [manager, date]);

  return (
    <>
      <h2>Agents & Attendance</h2>
      <div className="row">
        <ManagerSelect value={manager} onChange={setManager} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <h3>Attendance on {date}</h3>
      <table>
        <thead><tr><th>Agent</th><th>Manager</th><th>Status</th></tr></thead>
        <tbody>
          {att.map((a) => (
            <tr key={a._id}><td>{a.labour?.name || '(deleted)'}</td><td>{a.manager?.name || '-'}</td><td><Badge status={a.status} /></td></tr>
          ))}
          {!att.length && <tr><td colSpan="3">No attendance marked on this date</td></tr>}
        </tbody>
      </table>
      <h3 style={{ marginTop: 24 }}>All agents (manager wise)</h3>
      <table>
        <thead><tr><th>Name</th><th>Phone</th><th>Daily wage</th><th>Manager</th><th>Total present</th><th>Total absent</th></tr></thead>
        <tbody>
          {labour.map((l) => (
            <tr key={l._id}>
              <td>{l.name}</td><td>{l.phone || '-'}</td><td>{l.dailyWage || '-'}</td>
              <td>{l.manager?.name || '-'}</td><td>{l.present}</td><td>{l.absent}</td>
            </tr>
          ))}
          {!labour.length && <tr><td colSpan="6">No agents added</td></tr>}
        </tbody>
      </table>
    </>
  );
}
