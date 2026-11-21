import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Badge } from '../../components';
import { fmtDate, SITES, today } from '../../utils';

const blank = { title: '', type: 'house', address: '', site: '', status: 'empty' };
const blankRent = { tenantName: '', tenantPhone: '', amount: '', startDate: today(), endDate: '' };

export default function Properties() {
  const [list, setList] = useState([]);
  const [f, setF] = useState(blank);
  const [rentFor, setRentFor] = useState(null);
  const [r, setR] = useState(blankRent);
  const [err, setErr] = useState('');
  const load = () => api('/manager/properties').then(setList);
  useEffect(() => { load(); }, []);

  const run = async (fn) => { setErr(''); try { await fn(); load(); } catch (e) { setErr(e.message); } };

  return (
    <>
      <h2>Properties</h2>
      {err && <div className="err">{err}</div>}
      <form className="card" onSubmit={(e) => { e.preventDefault(); run(async () => { await api('/manager/properties', 'POST', f); setF(blank); }); }}>
        <b>Add ground / house / construction</b>
        <div className="row" style={{ marginTop: 10 }}>
          <input placeholder="Title (e.g. House 24, Street 5)" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required />
          <select value={f.site} onChange={(e) => setF({ ...f, site: e.target.value })} required>
            <option value="">Select site</option>
            {SITES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
            <option value="house">House</option><option value="ground">Ground</option>
          </select>
          <input placeholder="Address / plot details" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
          <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
            <option value="empty">Empty</option><option value="booked">Booked</option>
            <option value="under_construction">Under construction</option>
          </select>
          <button>Add</button>
        </div>
      </form>

      {rentFor && (
        <form className="card" onSubmit={(e) => { e.preventDefault(); run(async () => { await api(`/manager/properties/${rentFor}/rent`, 'PATCH', r); setRentFor(null); setR(blankRent); }); }}>
          <b>Rent out property</b>
          <div className="row" style={{ marginTop: 10 }}>
            <input placeholder="Tenant name" value={r.tenantName} onChange={(e) => setR({ ...r, tenantName: e.target.value })} required />
            <input placeholder="Tenant phone" value={r.tenantPhone} onChange={(e) => setR({ ...r, tenantPhone: e.target.value })} />
            <input type="number" placeholder="Rent amount" value={r.amount} onChange={(e) => setR({ ...r, amount: e.target.value })} />
            <label>From <input type="date" value={r.startDate} onChange={(e) => setR({ ...r, startDate: e.target.value })} /></label>
            <label>To <input type="date" value={r.endDate} onChange={(e) => setR({ ...r, endDate: e.target.value })} /></label>
            <button className="ok">Save rent</button>
            <button type="button" className="secondary" onClick={() => setRentFor(null)}>Cancel</button>
          </div>
        </form>
      )}

      <table>
        <thead><tr><th>Title</th><th>Site</th><th>Type</th><th>Status</th><th>Tenant / Rent</th><th>Actions</th></tr></thead>
        <tbody>
          {list.map((p) => (
            <tr key={p._id}>
              <td>{p.title}<div className="muted">{p.address}</div></td>
              <td>{p.site || '-'}</td>
              <td>{p.type}</td>
              <td>
                <Badge status={p.status} />
                {p.status !== 'rented' && (
                  <div>
                    <select value={p.status} onChange={(e) => run(() => api('/manager/properties/' + p._id, 'PUT', { status: e.target.value }))}>
                      <option value="empty">Empty</option><option value="booked">Booked</option>
                      <option value="under_construction">Under construction</option>
                    </select>
                  </div>
                )}
              </td>
              <td>{p.status === 'rented' ? <>{p.rent?.tenantName} ({p.rent?.tenantPhone || '-'})<div className="muted">{p.rent?.amount} from {fmtDate(p.rent?.startDate)}{p.rent?.endDate ? ' to ' + fmtDate(p.rent.endDate) : ''}</div></> : '-'}</td>
              <td>
                {p.status === 'rented'
                  ? <button className="small secondary" onClick={() => confirm('Free this property?') && run(() => api(`/manager/properties/${p._id}/free`, 'PATCH'))}>Free</button>
                  : p.status !== 'under_construction' && <button className="small ok" onClick={() => { setRentFor(p._id); setR(blankRent); window.scrollTo(0, 0); }}>Rent</button>}
                <button className="small danger" onClick={() => confirm('Delete property?') && run(() => api('/manager/properties/' + p._id, 'DELETE'))}>Delete</button>
              </td>
            </tr>
          ))}
          {!list.length && <tr><td colSpan="6">No properties yet</td></tr>}
        </tbody>
      </table>
    </>
  );
}
