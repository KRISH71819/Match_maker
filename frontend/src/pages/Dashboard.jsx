import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  Briefcase,
  CalendarClock,
  CheckCircle2,
  HeartHandshake,
  LogOut,
  MapPin,
  Search,
  Sparkles,
  Users,
  Filter
} from 'lucide-react';
import { fetchProfiles, fetchStats, getUser, logout } from '../lib/api';

const statusFilters = ['All', 'New Lead', 'In Progress', 'Match Sent', 'Paused', 'Closed'];
const genderFilters = ['All', 'Female', 'Male'];

function statusClass(status) {
  switch (status) {
    case 'New Lead': return 'tag-new';
    case 'In Progress': return 'tag-progress';
    case 'Match Sent': return 'tag-matched';
    case 'Paused': return 'tag-paused';
    default: return 'tag-closed';
  }
}

function StatCard({ icon, label, value, note, index }) {
  return (
    <div className="card stat-card motion-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="flex items-center justify-between">
        <div style={{ background: 'var(--surface-hover)', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}>
          {icon}
        </div>
      </div>
      <div>
        <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{value}</div>
        <div className="stat-label" style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '8px' }}>{label}</div>
        <div className="text-gray-light" style={{ fontSize: '0.85rem', marginTop: 4 }}>{note}</div>
      </div>
    </div>
  );
}

function ProfileCard({ profile }) {
  return (
    <Link to={`/profile/${profile.id}`} className="profile-card motion-row">
      <div className="profile-card-tag tag" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <span className={`tag ${statusClass(profile.status)}`} style={{ padding: '2px 8px' }}>{profile.status}</span>
      </div>
      
      <div className="profile-card-img-wrap">
        <img src={profile.profilePhoto} alt={`${profile.firstName} ${profile.lastName}`} className="profile-card-img" loading="lazy" />
        <div className="profile-card-overlay">
          <div className="profile-card-name">{profile.firstName} {profile.lastName}</div>
          <div className="profile-card-meta">
            <MapPin size={14} /> {profile.city} • {profile.age} yrs • {profile.gender}
          </div>
        </div>
      </div>
      
      <div className="profile-card-body">
        <div className="profile-info-row">
          <span className="profile-info-label">Marital Status</span>
          <span className="profile-info-val">{profile.maritalStatus}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Profession</span>
          <span className="profile-info-val">{profile.designation}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Religion</span>
          <span className="profile-info-val">{profile.religion}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [gender, setGender] = useState('All');

  const navigate = useNavigate();
  const user = getUser();
  const pageRef = useRef(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [profileData, statsData] = await Promise.all([
          fetchProfiles({ limit: 240 }),
          fetchStats(),
        ]);
        setProfiles(profileData.profiles || []);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo('.motion-hero', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo('.motion-card', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' }, "-=0.4")
        .fromTo('.motion-panel', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, "-=0.4")
        .fromTo('.motion-row', { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.5, ease: 'back.out(1.2)' }, "-=0.2");
    }, pageRef);
    return () => ctx.revert();
  }, [loading, status, gender, search]); // Re-run animation when filters change for the grid

  const filteredProfiles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return profiles.filter((profile) => {
      const matchesStatus = status === 'All' || profile.status === status;
      const matchesGender = gender === 'All' || profile.gender === gender;
      const searchText = [
        profile.firstName,
        profile.lastName,
        profile.city,
        profile.designation,
        profile.company,
        profile.maritalStatus,
      ].join(' ').toLowerCase();

      return matchesStatus && matchesGender && (!q || searchText.includes(q));
    });
  }, [profiles, search, status, gender]);

  const firstName = user?.name?.split(' ')[0] || 'Matchmaker';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem' }}>Loading workspace...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell" ref={pageRef}>
      <nav className="navbar glass">
        <div className="navbar-inner">
          <Link to="/dashboard" className="brand-lockup">
            <span className="brand-mark"><HeartHandshake size={20} color="#111" /></span>
            Matchmaker
          </Link>
          <div className="flex items-center gap-4">
            <div className="hide-mobile flex items-center gap-3" style={{ background: 'var(--surface-hover)', padding: '6px 16px 6px 6px', borderRadius: '99px' }}>
              <img src={user?.avatar} alt={user?.name || 'Matchmaker'} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, lineHeight: 1.2 }}>{user?.name || 'Matchmaker'}</div>
                <div className="text-gray-light" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{user?.role || 'Matchmaker'}</div>
              </div>
            </div>
            <button type="button" onClick={handleLogout} className="btn-outline btn-sm">
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="container-wide" style={{ paddingTop: '32px' }}>
        <section className="dashboard-hero motion-hero">
          <div className="ops-banner">
            <div className="ops-banner-content">
              <div>
                <div className="page-kicker"><Sparkles size={16} /> Welcome back</div>
                <h1 className="page-title" style={{ marginTop: 12, marginBottom: 16 }}>Ready to find their match, {firstName}?</h1>
                <p className="page-subtitle" style={{ fontSize: '1.1rem', maxWidth: '600px' }}>
                  Manage your exclusive client list, track their journey, and orchestrate perfect introductions with our AI-assisted scoring.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-4" style={{ marginBottom: 32 }}>
          <StatCard icon={<Users size={24} />} label="Total Portfolio" value={stats?.total || profiles.length} note="Active verified profiles" index={1} />
          <StatCard icon={<Sparkles size={24} />} label="New Leads" value={stats?.newLeads || 0} note="Awaiting discovery call" index={2} />
          <StatCard icon={<CalendarClock size={24} />} label="In Progress" value={stats?.inProgress || 0} note="Currently matchmaking" index={3} />
          <StatCard icon={<HeartHandshake size={24} />} label="Matches Sent" value={stats?.matchSent || 0} note="Introductions delivered" index={4} />
        </section>

        <section className="workbench">
          <aside className="sidebar-panel motion-panel panel">
            <div className="flex items-center gap-2 mb-6" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>
              <Filter size={20} /> Directory Filters
            </div>
            
            <div className="filter-stack">
              <div className="search-shell mb-4">
                <Search size={18} />
                <input
                  className="input"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, city, role..."
                />
              </div>

              <div className="mb-4">
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Journey Stage</div>
                <div className="segment">
                  {statusFilters.map((item) => (
                    <button key={item} type="button" className={status === item ? 'active' : ''} onClick={() => setStatus(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Gender Identity</div>
                <div className="segment">
                  {genderFilters.map((item) => (
                    <button key={item} type="button" className={gender === item ? 'active' : ''} onClick={() => setGender(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div style={{ paddingBottom: '40px' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Client Portfolio</h2>
                <p className="text-gray" style={{ fontSize: '1rem' }}>
                  Showing {filteredProfiles.length} highly curated profiles.
                </p>
              </div>
              <div className="tag" style={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '0.85rem', padding: '8px 16px' }}>
                <Briefcase size={16} color="var(--primary-dark)" /> Internal Pool
              </div>
            </div>

            <div className="customer-grid">
              {filteredProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>

            {filteredProfiles.length === 0 && (
              <div className="panel text-center" style={{ padding: '80px 20px', marginTop: '20px' }}>
                <Search size={48} color="var(--muted-2)" className="mx-auto mb-4" />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No matches found</h3>
                <p className="text-gray" style={{ fontSize: '1.1rem' }}>Adjust your filters or search term to discover clients.</p>
                <button className="btn-outline mt-4" onClick={() => { setSearch(''); setStatus('All'); setGender('All'); }}>Clear Filters</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
