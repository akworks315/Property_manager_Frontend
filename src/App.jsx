import { useEffect, useRef, useState } from 'react';
import { Navigate, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './auth';
import { Icon, Logo, Spinner, useTableLabels } from './components';
import { displayName, ROLE_LABEL } from './utils';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Managers from './pages/admin/Managers';
import AdminProperties from './pages/admin/Properties';
import Sessions from './pages/admin/Sessions';
import AdminLabour from './pages/admin/Labour';
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerProperties from './pages/manager/Properties';
import ManagerLabour from './pages/manager/Labour';

const LINKS = {
  admin: [
    ['/admin', 'Dashboard', true, 'dashboard'],
    ['/admin/managers', 'Managers', false, 'users'],
    ['/admin/properties', 'Properties', false, 'building'],
    ['/admin/sessions', 'Manager Sign In/Out', false, 'clock'],
    ['/admin/labour', 'Agents & Attendance', false, 'userCheck'],
  ],
  manager: [
    ['/manager', 'My Work', true, 'hardHat'],
    ['/manager/properties', 'Properties', false, 'building'],
    ['/manager/labour', 'Agents & Attendance', false, 'userCheck'],
  ],
};

function Layout() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const mainRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);
  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useTableLabels(mainRef, loc.pathname);

  const name = displayName(user);

  return (
    <div className={'app' + (open ? ' open' : '')}>
      <header className="topbar">
        <button className="icon-btn" onClick={() => setOpen(!open)} aria-label="Menu"><Icon name="menu" size={22} /></button>
        <Logo size={26} />
        <b>Property Manager</b>
      </header>
      <aside>
        <div className="brand"><Logo /><span>Property Manager</span></div>
        <div className="who">
          <span className="avatar">{(name || '?')[0].toUpperCase()}</span>
          <div><b>{name}</b><small>{ROLE_LABEL[user.role] || user.role}</small></div>
        </div>
        <nav>
          {LINKS[user.role].map(([to, label, end, icon]) => (
            <NavLink key={to} to={to} end={end}><Icon name={icon} />{label}</NavLink>
          ))}
        </nav>
        <div className="aside-foot">
          <button className="ghost" onClick={() => setDark(!dark)}><Icon name={dark ? 'sun' : 'moon'} />{dark ? 'Light mode' : 'Dark mode'}</button>
          <button className="ghost" onClick={logout}><Icon name="logout" />Logout</button>
        </div>
      </aside>
      <div className="scrim" onClick={() => setOpen(false)} />
      <main key={loc.pathname} ref={mainRef}><Outlet /></main>
    </div>
  );
}

function Protected({ role }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={'/' + user.role} replace />;
  return <Layout />;
}

function Home() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return <Navigate to={user ? '/' + user.role : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Protected role="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="managers" element={<Managers />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="labour" element={<AdminLabour />} />
      </Route>
      <Route path="/manager" element={<Protected role="manager" />}>
        <Route index element={<ManagerDashboard />} />
        <Route path="properties" element={<ManagerProperties />} />
        <Route path="labour" element={<ManagerLabour />} />
      </Route>
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
