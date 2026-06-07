import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, HeartHandshake, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import { login } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const pageRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.login-art', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
      gsap.fromTo('.login-card', { x: 28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.12 });
      gsap.to('.login-float', { y: -14, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.25 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      gsap.to(pageRef.current, {
        opacity: 0,
        duration: 0.28,
        onComplete: () => navigate('/dashboard'),
      });
    } catch (err) {
      console.error(err);
      let errorMsg = 'Invalid credentials. Please try again.';
      if (err.message === 'Network Error' || !err.response) {
        errorMsg = 'Cannot connect to backend. Check Vercel/Render Environment Variables or CORS.';
      } else if (err.response?.status === 404) {
        errorMsg = 'Backend API route not found. Did you set VITE_API_URL in Vercel?';
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }
      
      setError(errorMsg);
      gsap.fromTo(
        formRef.current,
        { x: -8 },
        { x: 8, duration: 0.08, yoyo: true, repeat: 5, onComplete: () => gsap.set(formRef.current, { x: 0 }) }
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('matchmaker@tdc.com');
    setPassword('tdc2024');
  };

  return (
    <div className="login-page" ref={pageRef}>
      <section className="login-left login-art">
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560 }}>
          <Link to="/" className="btn-outline btn-sm" style={{ background: 'rgba(255,255,255,0.7)', marginBottom: 28 }}>
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="page-kicker"><Sparkles size={16} /> Matchmaker internal product MVP</div>
          <h1 className="page-title" style={{ marginTop: 10 }}>Matchmaking work deserves calm software.</h1>
          <p className="page-subtitle" style={{ marginTop: 16 }}>
            View verified biodata, track journey status, write call notes, and send AI-assisted introductions from a focused command center.
          </p>

          <div className="grid grid-2" style={{ marginTop: 34 }}>
            {[
              ['200', 'sample profiles'],
              ['AI', 'score and intro'],
              ['5', 'journey stages'],
              ['100', 'opposite-gender pool'],
            ].map(([value, label]) => (
              <div key={label} className="quick-card login-float" style={{ background: 'rgba(255,255,255,0.72)' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900 }}>{value}</div>
                <div className="row-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="login-right">
        <div className="card login-card" ref={formRef}>
          <div className="text-center mb-8">
            <div className="brand-mark mx-auto mb-4" style={{ width: 48, height: 48, borderRadius: 15 }}>
              <HeartHandshake size={24} />
            </div>
            <h2 style={{ fontSize: '2rem' }}>Sign in</h2>
            <p className="text-gray">Use the sample matchmaker credentials below.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <label>
              <div className="row-label mb-3">Email Address</div>
              <div className="search-shell">
                <Mail size={17} />
                <input
                  type="email"
                  className="input"
                  placeholder="matchmaker@tdc.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </label>

            <label>
              <div className="row-label mb-3">Password</div>
              <div className="search-shell">
                <LockKeyhole size={17} />
                <input
                  type="password"
                  className="input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </label>

            {error && (
              <div className="quick-card" style={{ borderColor: '#ffd2dd', background: 'var(--rose-soft)', color: 'var(--rose)', fontWeight: 800 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> : 'Sign In'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
