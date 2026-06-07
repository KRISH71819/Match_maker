import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeartHandshake, ArrowRight, Sparkles, Flame, Zap, Ghost } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Nav animation
      gsap.fromTo('.nav-glass', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });

      // Hero text animations
      gsap.fromTo('.hero-title-line', 
        { y: 60, opacity: 0, rotateZ: 2 }, 
        { y: 0, opacity: 1, rotateZ: 0, stagger: 0.15, duration: 1, ease: 'back.out(1.2)', delay: 0.2 }
      );
      
      gsap.fromTo('.hero-subtitle', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 }
      );

      gsap.fromTo('.hero-cta', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.8 }
      );

      // Hero image grid staggered entrance with Gen Z 'pop'
      gsap.fromTo('.hero-img', 
        { y: 100, opacity: 0, scale: 0.8, rotateZ: () => Math.random() * 20 - 10 }, 
        { y: 0, opacity: 1, scale: 1, rotateZ: (i) => [-6, 4, 8][i], stagger: 0.15, duration: 1.2, ease: 'back.out(1.5)', delay: 0.4 }
      );

      // Scroll animations for sections
      gsap.utils.toArray('.scroll-section').forEach((section) => {
        gsap.fromTo(section,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Floating animations for decorative elements
      gsap.to('.float-slow', {
        y: -15,
        rotation: 2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="app-shell" style={{ overflowX: 'hidden' }}>
      
      {/* ─── NAVBAR ─── */}
      <nav className="navbar glass nav-glass" style={{ position: 'fixed', width: '100%', zIndex: 100 }}>
        <div className="navbar-inner">
          <div className="brand-lockup" style={{ fontSize: '1.2rem', letterSpacing: '-0.05em' }}>
            <span className="brand-mark"><HeartHandshake size={20} color="#111" /></span>
            Matchmaker 
          </div>
          <div className="flex gap-4 hide-mobile" style={{ background: 'var(--surface-hover)', padding: '6px 20px', borderRadius: '99px', fontSize: '0.9rem', fontWeight: 800 }}>
            <a href="#features" style={{ color: 'var(--ink)', textDecoration: 'none', transition: 'color 0.2s' }}>The Vibe</a>
            <span style={{ color: 'var(--border-strong)', margin: '0 8px' }}>|</span>
            <a href="#how-it-works" style={{ color: 'var(--ink)', textDecoration: 'none', transition: 'color 0.2s' }}>How it Works</a>
          </div>
          <Link to="/login" className="btn-primary" style={{ padding: '10px 24px', borderRadius: '12px' }}>
            Enter Workspace
          </Link>
        </div>
      </nav>

      {/* ─── GEN Z EDITORIAL HERO ─── */}
      <section style={{ paddingTop: '180px', paddingBottom: '100px', paddingLeft: '40px', paddingRight: '40px' }}>
        <div className="container-wide grid grid-2" style={{ alignItems: 'center', gap: '60px' }}>
          
          {/* Left Text */}
          <div style={{ maxWidth: '600px' }}>
            <div className="page-kicker hero-subtitle mb-4" style={{ display: 'inline-flex', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800 }}>
              <Flame size={16} color="var(--primary)" /> Skip the talking stage.
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', color: 'var(--ink)', lineHeight: 1, marginBottom: '24px', letterSpacing: '-0.04em' }}>
              <div className="hero-title-line overflow-hidden">Match energy,</div>
              <div className="hero-title-line overflow-hidden">not just <span style={{ color: 'var(--primary-dark)', position: 'relative' }}>
                  algorithms
                  <svg className="float-slow" style={{ position: 'absolute', right: '-40px', top: '-10px' }} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="var(--primary)"/>
                  </svg>
                </span>.
              </div>
            </h1>
            <p className="hero-subtitle text-gray" style={{ fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '40px', maxWidth: '500px', fontWeight: 500 }}>
              The exclusive internal workspace for matchmakers. Because finding someone's person takes actual human intuition (and a really smart AI).
            </p>
            <div className="hero-cta flex gap-4">
              <Link to="/login" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '16px', boxShadow: '4px 4px 0 var(--ink)', transition: 'all 0.2s', border: '2px solid var(--ink)' }}>
                Start Matching <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Right Gen Z Image Grid (Candid / Film aesthetic) */}
          <div style={{ position: 'relative', height: '600px' }} className="hide-mobile">
            {/* Main Center Image */}
            <div className="hero-img float-slow" style={{ position: 'absolute', top: '5%', left: '10%', width: '60%', height: '75%', borderRadius: '16px', overflow: 'hidden', boxShadow: '8px 8px 0 var(--primary)', border: '4px solid var(--ink)', zIndex: 2 }}>
              <img src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80" alt="Candid couple laughing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'var(--ink)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={16} color="var(--primary)" /> Vibe check passed
              </div>
            </div>
            
            {/* Top Right Small Image */}
            <div className="hero-img" style={{ position: 'absolute', top: '-5%', right: '0', width: '40%', height: '45%', borderRadius: '16px', overflow: 'hidden', border: '4px solid var(--ink)', zIndex: 1 }}>
              <img src="https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=400&q=80" alt="Cool portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Bottom Left Small Image */}
            <div className="hero-img" style={{ position: 'absolute', bottom: '5%', left: '-5%', width: '45%', height: '40%', borderRadius: '16px', overflow: 'hidden', border: '4px solid var(--ink)', zIndex: 3 }}>
              <img src="https://images.unsplash.com/photo-1601288496920-b6154fe3626a?auto=format&fit=crop&w=400&q=80" alt="Film camera aesthetic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
          
        </div>
      </section>

      {/* ─── FEATURES (GEN Z COPY) ─── */}
      <section id="features" className="scroll-section" style={{ padding: '100px 40px', background: 'white', borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)' }}>
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '3rem', color: 'var(--ink)', marginBottom: '16px', letterSpacing: '-0.03em' }}>The Math is Mathing</h2>
            <p className="text-gray" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', fontWeight: 500 }}>We built the ultimate operating system for matchmakers to stop guessing and start connecting.</p>
          </div>

          <div className="grid grid-3" style={{ gap: '32px' }}>
            <div className="card" style={{ padding: '40px', border: '2px solid var(--ink)', borderRadius: '16px', boxShadow: '4px 4px 0 rgba(0,0,0,0.05)' }}>
              <div style={{ width: 64, height: 64, background: 'var(--surface-hover)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: '2px solid var(--ink)' }}>
                <HeartHandshake size={32} color="#111" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, marginBottom: 12 }}>Curated Rosters</h3>
              <p className="text-gray" style={{ lineHeight: 1.6, fontSize: '1.1rem' }}>No catfishes here. Manage highly vetted client profiles with deep biodata, red/green flags, and your private notes.</p>
            </div>

            <div className="card" style={{ padding: '40px', border: '2px solid var(--ink)', borderRadius: '16px', background: 'var(--primary)', boxShadow: '4px 4px 0 var(--ink)' }}>
              <div style={{ width: 64, height: 64, background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: '2px solid var(--ink)' }}>
                <Sparkles size={32} color="#111" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, marginBottom: 12 }}>AI Wingman</h3>
              <p className="text-gray" style={{ lineHeight: 1.6, fontSize: '1.1rem', color: 'var(--ink)' }}>Leverage our Smart AI to analyze lifestyle data and surface matches that actually make sense IRL.</p>
            </div>

            <div className="card" style={{ padding: '40px', border: '2px solid var(--ink)', borderRadius: '16px', boxShadow: '4px 4px 0 rgba(0,0,0,0.05)' }}>
              <div style={{ width: 64, height: 64, background: 'var(--surface-hover)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: '2px solid var(--ink)' }}>
                <Ghost size={32} color="#111" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, marginBottom: 12 }}>No Ghosting Zone</h3>
              <p className="text-gray" style={{ lineHeight: 1.6, fontSize: '1.1rem' }}>Track every client's journey from 'New Lead' to 'Match Sent'. Keep the momentum going without the burnout.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MORE CONTENT: MANIFESTO / SOCIAL PROOF ─── */}
      <section className="scroll-section" style={{ padding: '120px 40px', background: 'var(--surface-hover)' }}>
        <div className="container-wide grid grid-2" style={{ alignItems: 'center', gap: '80px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--ink)', lineHeight: 1, marginBottom: '24px', letterSpacing: '-0.04em' }}>
              Dating apps are <span style={{ textDecoration: 'line-through', color: 'var(--muted)' }}>exhausting</span>. We fixed it.
            </h2>
            <p className="text-gray" style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '24px', fontWeight: 500 }}>
              The modern dating scene is broken. Endless swiping, low effort conversations, and mismatched expectations.
            </p>
            <p className="text-gray" style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '40px', fontWeight: 500 }}>
              Matchmaker equips our elite team with the tools to curate relationships that matter. We look at the data so you can focus on the chemistry.
            </p>
            <div className="flex gap-4">
              <div style={{ background: 'white', padding: '16px 24px', borderRadius: '12px', border: '2px solid var(--ink)', boxShadow: '2px 2px 0 var(--primary)' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900 }}>85%</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase' }}>Success Rate</div>
              </div>
              <div style={{ background: 'white', padding: '16px 24px', borderRadius: '12px', border: '2px solid var(--ink)', boxShadow: '2px 2px 0 var(--primary)' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900 }}>10k+</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase' }}>Vibe Checks</div>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Team collaborating" style={{ width: '100%', borderRadius: '24px', border: '4px solid var(--ink)', boxShadow: '-12px 12px 0 var(--primary)' }} />
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="scroll-section" style={{ padding: '120px 40px' }}>
        <div className="container-wide">
          <div style={{ background: 'var(--ink)', borderRadius: '32px', padding: '100px 40px', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative background circle */}
            <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'var(--primary)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 'clamp(3rem, 6vw, 4.5rem)', marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1 }}>
                Ready to find <span style={{ color: 'var(--primary)' }}>their person?</span>
              </h2>
              <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 48px', lineHeight: 1.6 }}>
                Log in to your workspace and let's get these clients off the apps and into real relationships.
              </p>
              <Link to="/login" className="btn-primary" style={{ padding: '20px 48px', fontSize: '1.2rem', borderRadius: '16px', background: 'var(--primary)', color: 'var(--ink)', border: '2px solid white', boxShadow: '4px 4px 0 white', transition: 'transform 0.1s' }}>
                Enter the Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: '2px solid var(--ink)', padding: '40px', background: 'white' }}>
        <div className="container-wide flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '20px' }}>
          <div className="brand-lockup" style={{ fontSize: '1.2rem' }}>
            <span className="brand-mark" style={{ background: 'var(--surface-hover)' }}><HeartHandshake size={18} color="#111" /></span>
            Matchmaker 
          </div>
          <div className="text-gray" style={{ fontSize: '1rem', fontWeight: 600 }}>
            © {new Date().getFullYear()} Matchmaker. No cap.
          </div>
        </div>
      </footer>
    </div>
  );
}
