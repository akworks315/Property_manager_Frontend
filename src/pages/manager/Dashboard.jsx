import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Spinner } from '../../components';
import { duration, fmt, SITES } from '../../utils';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [site, setSite] = useState('');
  const [err, setErr] = useState('');
  const [, setTick] = useState(0);
  const load = () => api('/manager/sessions').then(setData);

  useEffect(() => {
    load();
    const t = setInterval(() => setTick((x) => x + 1), 30000); // refresh the live timer
    return () => clearInterval(t);
  }, []);

  const act = async (path, body) => {
    setErr('');
    try { await api(path, 'POST', body); load(); } catch (e) { setErr(e.message); }
  };
  if (!data) return <Spinner />;
  const { current, history } = data;

  return (
    <>
      <div className="page-head">
        <h2>My Work</h2>
        <p className="muted">Sign in when you reach the site and check out when you are done.</p>
      </div>
      <div className={'card work-card' + (current ? ' on' : '')}>
        <div>
          <div className="work-state"><span className="pulse" />{current ? 'You are working' : 'You are off duty'}</div>
          {current && (
            <p className="muted" style={{ margin: '6px 0 0' }}>
              Since {fmt(current.signInAt)}{current.site ? ` at ${current.site}` : ''} ({duration(current.signInAt)})
            </p>
          )}
          {err && <div className="err">{err}</div>}
        </div>
        {current ? (
          <button className="danger" onClick={() => act('/manager/signout')}>Check out</button>
        ) : (
          <div className="row" style={{ marginBottom: 0 }}>
            <select value={site} onChange={(e) => setSite(e.target.value)}>
              <option value="">Select site</option>
              {SITES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="ok" disabled={!site} onClick={() => act('/manager/signin', { site })}>Sign in</button>
          </div>
        )}
      </div>
      <h3>History</h3>
      <table>
        <thead><tr><th>Site</th><th>Sign in</th><th>Sign out</th><th>Worked</th></tr></thead>
        <tbody>
          {history.map((s) => (
            <tr key={s._id}>
              <td>{s.site || '-'}</td><td>{fmt(s.signInAt)}</td>
              <td>{s.signOutAt ? fmt(s.signOutAt) : <span className="badge present">Working now</span>}</td>
              <td>{duration(s.signInAt, s.signOutAt)}</td>
            </tr>
          ))}
          {!history.length && <tr><td colSpan="4">No history yet. Sign in to start your first shift.</td></tr>}
        </tbody>
      </table>
    </>
  );
}
