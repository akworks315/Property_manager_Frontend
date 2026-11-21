import { useEffect, useState } from 'react';
import { api } from '../../api';
import { ManagerSelect } from '../../components';
import { duration, fmt } from '../../utils';

export default function Sessions() {
  const [list, setList] = useState([]);
  const [manager, setManager] = useState('');
  useEffect(() => { api('/admin/sessions' + (manager ? '?manager=' + manager : '')).then(setList); }, [manager]);

  return (
    <>
      <h2>Manager Sign In / Sign Out</h2>
      <div className="row"><ManagerSelect value={manager} onChange={setManager} /></div>
      <table>
        <thead><tr><th>Manager</th><th>Site</th><th>Sign in</th><th>Sign out</th><th>Worked</th></tr></thead>
        <tbody>
          {list.map((s) => (
            <tr key={s._id}>
              <td>{s.manager?.name || '(deleted)'}</td><td>{s.site || '-'}</td>
              <td>{fmt(s.signInAt)}</td>
              <td>{s.signOutAt ? fmt(s.signOutAt) : <span className="badge present">Working now</span>}</td>
              <td>{duration(s.signInAt, s.signOutAt)}</td>
            </tr>
          ))}
          {!list.length && <tr><td colSpan="5">No records</td></tr>}
        </tbody>
      </table>
    </>
  );
}
