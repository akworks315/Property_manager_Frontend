import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Icon, Logo } from '../components';
import { SITES } from '../utils';

// height %, delay, colour for each building in the skyline
const BUILDINGS = [
  [38, 0.0, '#1b3358'], [64, 0.12, '#223e6b'], [47, 0.24, '#1b3358'], [88, 0.36, '#2a4a7e'],
  [56, 0.48, '#1b3358'], [74, 0.6, '#223e6b'], [43, 0.72, '#1b3358'], [66, 0.84, '#2a4a7e'],
];

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const u = await login(email, password);
      nav('/' + u.role);
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="login">
      <section className="login-hero">
        <div className="brand"><Logo /><span>Property Manager</span></div>
        <h1>Every property and every site, in one place.</h1>
        <p>Rentals, construction progress and daily agent attendance, always up to date.</p>
        <div className="chips">
          {SITES.map((s) => <span className="chip" key={s}><Icon name="pin" size={14} />{s}</span>)}
        </div>
        <div className="skyline" aria-hidden="true">
          {BUILDINGS.map(([h, d, c], i) => (
            <i key={i} className="bld" style={{ '--h': h + '%', '--d': d + 's', '--bc': c }} />
          ))}
        </div>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={submit}>
          <div className="mobile-brand"><Logo size={34} /></div>
          <h2>Welcome back</h2>
          <p className="muted">Sign in to continue.</p>
          {err && <div className="err">{err}</div>}
          <label className="field">Email
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </label>
          <label className="field">Password
            <span className="pw">
              <input type={show ? 'text' : 'password'} placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="pw-toggle" onClick={() => setShow(!show)} aria-label="Show or hide password"><Icon name={show ? 'eyeOff' : 'eye'} /></button>
            </span>
          </label>
          <button className="block" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </section>
    </div>
  );
}
