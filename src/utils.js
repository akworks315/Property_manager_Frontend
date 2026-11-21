export const today = () => new Date().toISOString().slice(0, 10);
export const fmt = (d) => (d ? new Date(d).toLocaleString() : '-');
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '-');

export function duration(from, to) {
  if (!from) return '-';
  const ms = (to ? new Date(to) : new Date()) - new Date(from);
  const mins = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(mins / 1440);
  const hrs = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  if (days > 0) return `${days}d ${hrs}h`;
  return `${hrs}h ${m}m`;
}

export const STATUS_LABEL = { empty: 'Empty', rented: 'Rented', booked: 'Booked', under_construction: 'Under construction' };
export const SITES = ['B-17', 'Faisal Margalla City', 'Faisal Hills'];
export const ROLE_LABEL = { admin: 'Owner', manager: 'Manager' };
export const displayName = (u) => (u.role === 'admin' && u.name === 'Admin' ? 'Owner' : u.name);
