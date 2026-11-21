import { useEffect, useState } from 'react';
import { api } from '../../api';
import { useAuth } from '../../auth';
import { Count, Icon, Spinner } from '../../components';
import { displayName, duration, fmt, SITES } from '../../utils';

const SEGMENTS = [
  ['rented', 'Rented', 'var(--mint)'],
  ['empty', 'Empty', 'var(--sky)'],
  ['booked', 'Booked', 'var(--amber)'],
  ['under_construction', 'Under construction', 'var(--violet)'],
];

export default function Dashboard() {
  const { user } = useAuth();
  const [s, setS] = useState(null);
  const [live, setLive] = useState([]);

  useEffect(() => {
    const load = () => {
      api('/admin/summary').then(setS);
      api('/admin/active').then(setLive);
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);
  if (!s) return <Spinner />;

  const tiles = [
    ['layers', 'Total properties', s.total, 'sky'],
    ['key', 'Rented', s.rented, 'mint'],
    ['home', 'Empty', s.empty, 'sky'],
    ['calendarCheck', 'Booked', s.booked, 'amber'],
    ['hardHat', 'Under construction', s.under_construction, 'violet'],
    ['users', 'Managers', s.managers, 'navy'],
  ];

  return (
    <>
      <div className="page-head">
        <h2>Welcome back, {displayName(user)}</h2>
        <p className="muted">Here is how your sites and managers are doing today.</p>
      </div>

      <div className="card">
        <div className="card-head">
          <h3><Icon name="activity" />Working right now</h3>
          <span className={'badge ' + (live.length ? 'present' : 'inactive')}>{live.length} of {s.managers} managers active</span>
        </div>
        {live.length ? (
          <div className="live-list">
            {live.map((x) => (
              <div className="live-item" key={x._id}>
                <span className="avatar">{(x.manager?.name || '?')[0].toUpperCase()}</span>
                <div>
                  <b>{x.manager?.name || '(deleted)'}</b>
                  <small>{x.site || 'Site not selected'}</small>
                  <small>Since {fmt(x.signInAt)} ({duration(x.signInAt)})</small>
                </div>
                <span className="pulse" />
              </div>
            ))}
          </div>
        ) : (
          <p className="muted" style={{ margin: 0 }}>No manager is signed in right now.</p>
        )}
      </div>

      <div className="cards">
        {tiles.map(([icon, label, value, tone]) => (
          <div className="stat" data-tone={tone} key={label}>
            <span className="ico"><Icon name={icon} size={20} /></span>
            <b><Count n={value} /></b>
            {label}
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 6 }}>Sites</h3>
      <div className="sites">
        {SITES.map((name) => {
          const d = (s.bySite && s.bySite[name]) || { total: 0 };
          return (
            <div className="card site-card" key={name}>
              <div className="site-name"><Icon name="pin" />{name}</div>
              <div className="site-total"><Count n={d.total} /> <span>properties</span></div>
              <div className="site-stats">
                {SEGMENTS.map(([k, label, color]) => (
                  <span key={k}><i style={{ background: color }} />{label} {d[k] || 0}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Portfolio breakdown</h3>
        {s.total > 0 ? (
          <>
            <div className="bar">
              {SEGMENTS.map(([k, label, color]) => s[k] > 0 && (
                <span key={k} className="seg" style={{ flexGrow: s[k], background: color }} title={`${label}: ${s[k]}`} />
              ))}
            </div>
            <div className="legend">
              {SEGMENTS.map(([k, label, color]) => (
                <span key={k}><i style={{ background: color }} />{label} ({s[k]})</span>
              ))}
            </div>
          </>
        ) : (
          <p className="muted">No properties yet. Properties added by managers will show up here.</p>
        )}
      </div>
    </>
  );
}
