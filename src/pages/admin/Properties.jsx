import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Badge, ManagerSelect } from '../../components';
import { duration, fmtDate, SITES, STATUS_LABEL } from '../../utils';

export default function Properties() {
  const [list, setList] = useState([]);
  const [manager, setManager] = useState('');
  const [status, setStatus] = useState('');
  const [site, setSite] = useState('');

  useEffect(() => {
    const q = new URLSearchParams({ ...(manager && { manager }), ...(status && { status }), ...(site && { site }) }).toString();
    api('/admin/properties' + (q ? '?' + q : '')).then(setList);
  }, [manager, status, site]);

  return (
    <>
      <h2>Properties</h2>
      <div className="row">
        <select value={site} onChange={(e) => setSite(e.target.value)}>
          <option value="">All sites</option>
          {SITES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <ManagerSelect value={manager} onChange={setManager} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All status</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <table>
        <thead>
          <tr><th>Title</th><th>Site</th><th>Type</th><th>Manager</th><th>Status</th><th>Tenant</th><th>Rent</th><th>Since</th><th>Duration</th></tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p._id}>
              <td>{p.title}<div className="muted">{p.address}</div></td>
              <td>{p.site || '-'}</td>
              <td>{p.type}</td>
              <td>{p.manager?.name || '-'}</td>
              <td><Badge status={p.status} /></td>
              <td>{p.status === 'rented' ? `${p.rent?.tenantName || ''} ${p.rent?.tenantPhone || ''}` : '-'}</td>
              <td>{p.status === 'rented' ? p.rent?.amount : '-'}</td>
              <td>{p.status === 'rented' ? fmtDate(p.rent?.startDate) : p.status === 'under_construction' ? fmtDate(p.constructionStartDate) : '-'}</td>
              <td>{p.status === 'rented' ? duration(p.rent?.startDate) : p.status === 'under_construction' ? duration(p.constructionStartDate) : '-'}</td>
            </tr>
          ))}
          {!list.length && <tr><td colSpan="9">No properties</td></tr>}
        </tbody>
      </table>
    </>
  );
}
