import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  Baby,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Heart,
  HeartHandshake,
  Home,
  IndianRupee,
  Languages,
  Mail,
  MapPin,
  PawPrint,
  Phone,
  Plane,
  Ruler,
  Search,
  Send,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { fetchMatches, fetchProfile, getAIMatchScore, sendMatch } from '../lib/api';
import AIModal from '../components/AIModal';
import NotesPanel from '../components/NotesPanel';
import StatusChanger from '../components/StatusChanger';
import Toast from '../components/Toast';

gsap.registerPlugin(ScrollTrigger);

function formatDate(dateString) {
  if (!dateString) return 'Not available';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function InfoChip({ icon, label, value }) {
  return (
    <div className="info-chip">
      <span className="info-chip-icon">{icon}</span>
      <div className="min-w-0">
        <div className="info-chip-label">{label}</div>
        <div className="info-chip-value">{value || 'Not available'}</div>
      </div>
    </div>
  );
}

function PreferenceTag({ label, value, icon }) {
  const normalized = String(value || '').toLowerCase();
  const className = normalized === 'yes' ? 'pref-yes' : normalized === 'no' ? 'pref-no' : 'pref-maybe';

  return (
    <span className={`pref-tag ${className}`}>
      {icon} {label}: {value}
    </span>
  );
}

export default function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileData, matchData] = await Promise.all([
          fetchProfile(id),
          fetchMatches(id),
        ]);
        setProfile(profileData);
        setMatches(matchData.matches || []);
      } catch (error) {
        console.error('Failed to load profile details', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [id]);

  useEffect(() => {
    if (loading || !profile) return;
    const ctx = gsap.context(() => {
      // Intro animations
      gsap.fromTo('.motion-hero', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.motion-section', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out', delay: 0.2 });
      
      // Scroll-triggered animations for bio sections
      const sections = gsap.utils.toArray('.scroll-reveal');
      sections.forEach(sec => {
        gsap.fromTo(sec, 
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, [loading, profile]);

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const fields = [
      'firstName', 'lastName', 'gender', 'dateOfBirth', 'city', 'height', 'email', 'phone',
      'college', 'degree', 'income', 'company', 'designation', 'maritalStatus', 'languages',
      'siblings', 'caste', 'religion', 'wantKids', 'openToRelocate', 'openToPets',
    ];
    const filled = fields.filter((field) => {
      const value = profile[field];
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    }).length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  const handleSendMatch = async (match) => {
    setSelectedMatch(match);
    setAiResult(null);
    setShowModal(true);

    try {
      const result = await getAIMatchScore(profile.id, match.id);
      setAiResult(result);
    } catch (error) {
      console.error('Failed to get AI score', error);
    }
  };

  const handleConfirmMatch = async () => {
    try {
      await sendMatch(profile.id, selectedMatch.id);
      setShowModal(false);
      setToastMsg(`Match intro sent to ${selectedMatch.firstName}.`);
      setProfile({ ...profile, status: 'Match Sent' });
    } catch (error) {
      console.error('Failed to confirm match', error);
    }
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

  if (!profile) {
    return (
      <div className="app-shell flex flex-col gap-4 items-center justify-center">
        <Search size={48} color="var(--muted-2)" />
        <h2 style={{ fontSize: '2rem' }}>Profile not found</h2>
        <Link to="/dashboard" className="btn-primary">Return to Directory</Link>
      </div>
    );
  }

  return (
    <div className="app-shell" ref={pageRef}>
      <nav className="navbar glass">
        <div className="navbar-inner">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-ghost" style={{ paddingLeft: 0 }}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <Link to="/dashboard" className="brand-lockup hide-mobile">
            <span className="brand-mark"><HeartHandshake size={20} color="#111" /></span>
            Matchmaker
          </Link>
          <button
            type="button"
            className="btn-primary"
            onClick={() => document.getElementById('matches-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Sparkles size={16} /> View Matches
          </button>
        </div>
      </nav>

      <main className="container-wide profile-workspace">
        {/* LEFT PANE - STICKY HERO */}
        <aside className="motion-hero">
          <div className="profile-sticky-hero">
            <img src={profile.profilePhoto} alt={`${profile.firstName} ${profile.lastName}`} className="profile-hero-img" />
            <div className="profile-hero-content">
              <div className="page-kicker mb-3">ID: {profile.id} • {profile.status}</div>
              <h1 className="profile-hero-name">{profile.firstName} {profile.lastName}</h1>
              
              <div className="profile-hero-badges">
                <span className="tag" style={{ border: '1px solid var(--border)' }}><MapPin size={14} /> {profile.city}, {profile.country}</span>
                <span className="tag" style={{ border: '1px solid var(--border)' }}><Calendar size={14} /> {profile.age} yrs</span>
                <span className="tag" style={{ border: '1px solid var(--border)' }}><Ruler size={14} /> {profile.height}</span>
              </div>

              <div style={{ background: 'var(--surface-hover)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completion</span>
                  <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>{profileCompletion}%</strong>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: 'var(--border-strong)', overflow: 'hidden' }}>
                  <div style={{ width: `${profileCompletion}%`, height: '100%', background: 'var(--primary)' }} />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <StatusChanger profileId={profile.id} initialStatus={profile.status} />
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT PANE - BIODATA */}
        <div className="bio-sections">
          
          <div className="grid grid-2 motion-section">
            <NotesPanel profileId={profile.id} initialNotes={profile.notes} />
            
            <div className="bio-card">
              <div className="bio-card-title"><User size={20} /> About User</div>
              <p className="text-gray" style={{ fontSize: '1rem', lineHeight: 1.8 }}>{profile.bio || "No summary provided."}</p>
            </div>
          </div>

          <div className="bio-card scroll-reveal">
            <div className="bio-card-title"><User size={20} /> Personal Biodata</div>
            <div className="info-grid">
              <InfoChip icon={<User size={18} />} label="Full Name" value={`${profile.firstName} ${profile.lastName}`} />
              <InfoChip icon={<Users size={18} />} label="Gender" value={profile.gender} />
              <InfoChip icon={<Calendar size={18} />} label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
              <InfoChip icon={<Heart size={18} />} label="Marital Status" value={profile.maritalStatus} />
              <InfoChip icon={<Languages size={18} />} label="Languages" value={profile.languages.join(', ')} />
              <InfoChip icon={<Home size={18} />} label="Family Type" value={profile.familyType} />
              <InfoChip icon={<Users size={18} />} label="Siblings" value={profile.siblings} />
            </div>
          </div>

          <div className="bio-card scroll-reveal">
            <div className="bio-card-title"><Briefcase size={20} /> Career & Education</div>
            <div className="info-grid">
              <InfoChip icon={<Briefcase size={18} />} label="Profession" value={profile.designation} />
              <InfoChip icon={<Building2 size={18} />} label="Company" value={profile.company} />
              <InfoChip icon={<IndianRupee size={18} />} label="Income" value={profile.income} />
              <InfoChip icon={<GraduationCap size={18} />} label="Education" value={`${profile.degree} at ${profile.college}`} />
              <InfoChip icon={<User size={18} />} label="Father's Occ." value={profile.fatherOccupation} />
            </div>
          </div>

          <div className="bio-card scroll-reveal">
            <div className="bio-card-title"><BookOpen size={20} /> Culture & Religion</div>
            <div className="info-grid">
              <InfoChip icon={<Heart size={18} />} label="Religion" value={profile.religion} />
              <InfoChip icon={<Users size={18} />} label="Caste" value={profile.caste} />
              <InfoChip icon={<Sparkles size={18} />} label="Horoscope" value={profile.horoscope} />
              <InfoChip icon={<Sparkles size={18} />} label="Manglik" value={profile.manglik} />
              <InfoChip icon={<Home size={18} />} label="Family Values" value={profile.familyValues} />
              <InfoChip icon={<Languages size={18} />} label="Mother Tongue" value={profile.motherTongue} />
            </div>
          </div>

          <div className="bio-card scroll-reveal">
            <div className="bio-card-title"><Heart size={20} /> Lifestyle Preferences</div>
            <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
              <PreferenceTag icon={<Baby size={16} />} label="Want Kids" value={profile.wantKids} />
              <PreferenceTag icon={<Plane size={16} />} label="Open to Relocate" value={profile.openToRelocate} />
              <PreferenceTag icon={<PawPrint size={16} />} label="Open to Pets" value={profile.openToPets} />
              <PreferenceTag icon={<BookOpen size={16} />} label="Diet" value={profile.dietaryPreference} />
            </div>
          </div>

          <div className="bio-card scroll-reveal">
            <div className="bio-card-title"><Phone size={20} /> Contact Details</div>
            <div className="info-grid">
              <InfoChip icon={<Mail size={18} />} label="Email" value={profile.email} />
              <InfoChip icon={<Phone size={18} />} label="Phone" value={profile.phone} />
            </div>
          </div>

          {/* MATCH QUEUE */}
          <div id="matches-section" className="bio-card scroll-reveal" style={{ background: 'var(--surface-hover)', borderColor: 'var(--primary-dark)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '4px' }}><Sparkles size={24} color="var(--primary-dark)" /> Intelligent Matches</h2>
                <p className="text-gray" style={{ fontSize: '1rem' }}>AI-ranked compatible profiles.</p>
              </div>
              <div className="match-score-badge" style={{ background: '#111', color: '#fff', fontSize: '1rem' }}>{matches.length} found</div>
            </div>

            <div className="match-queue">
              {matches.map((match) => (
                <div key={match.id} className="match-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={match.profilePhoto} alt={`${match.firstName} ${match.lastName}`} style={{ width: 72, height: 72, borderRadius: 16, objectFit: 'cover' }} />
                      <div className="min-w-0">
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: 4 }} className="truncate">
                          {match.firstName} {match.lastName}
                        </div>
                        <div className="text-gray" style={{ fontSize: '0.9rem', marginBottom: 2 }}>
                          {match.age} yrs • {match.city} • {match.height}
                        </div>
                        <div className="truncate text-gray-light" style={{ fontSize: '0.85rem' }}>{match.designation} at {match.company}</div>
                      </div>
                    </div>
                    <div className="match-score-badge" style={{ background: 'var(--primary)', color: 'var(--ink)' }}>{match.compatibilityScore}%</div>
                  </div>

                  <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                    {match.matchReasons.slice(0, 4).map((reason) => (
                      <span key={reason} className="tag tag-new" style={{ border: 'none', background: 'rgba(0,0,0,0.05)' }}>{reason}</span>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-2">
                    <Link to={`/profile/${match.id}`} target="_blank" className="btn-outline flex-1">View Profile</Link>
                    <button type="button" onClick={() => handleSendMatch(match)} className="btn-primary flex-1" style={{ background: 'var(--ink)', color: '#fff' }}>
                      <Send size={16} /> Generate Intro
                    </button>
                  </div>
                </div>
              ))}

              {matches.length === 0 && (
                <div className="text-center" style={{ padding: '40px 20px' }}>
                  <Search size={40} color="var(--muted-2)" className="mx-auto mb-3" />
                  <h3 style={{ fontSize: '1.2rem', marginBottom: 4 }}>No suggested matches</h3>
                  <p className="text-gray">The current pool did not find highly compatible profiles.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showModal && selectedMatch && (
        <AIModal
          profile={profile}
          match={selectedMatch}
          aiResult={aiResult}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmMatch}
        />
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
