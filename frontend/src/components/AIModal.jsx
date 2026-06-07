import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { AlertCircle, Check, HeartHandshake, Loader2, Send, Sparkles, X } from 'lucide-react';
import { getProfileFit } from '../lib/api';

export default function AIModal({ profile, match, aiResult, onClose, onConfirm }) {
  const modalRef = useRef(null);
  const [loadingExtra, setLoadingExtra] = useState(false);
  const [profileFit, setProfileFit] = useState(null);

  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { y: 24, scale: 0.96, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.36, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    async function loadProfileFit() {
      if (!aiResult) return;
      setLoadingExtra(true);
      try {
        const fit = await getProfileFit(profile.id, match.id);
        setProfileFit(fit);
      } catch (error) {
        console.error('Failed to load profile fit reasoning', error);
      } finally {
        setLoadingExtra(false);
      }
    }

    loadProfileFit();
  }, [aiResult, profile.id, match.id]);

  useEffect(() => {
    if (!aiResult) return;
    const scoreEl = modalRef.current?.querySelector('.score-value');
    if (!scoreEl) return;
    gsap.from(scoreEl, {
      textContent: 0,
      duration: 1,
      ease: 'power2.out',
      snap: { textContent: 1 },
    });
  }, [aiResult]);

  const closeWithAnimation = () => {
    gsap.to(modalRef.current, {
      y: 16,
      scale: 0.97,
      opacity: 0,
      duration: 0.24,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={closeWithAnimation} />
      <div className="modal-content" ref={modalRef}>
        <button
          type="button"
          onClick={closeWithAnimation}
          className="btn-ghost btn-sm"
          style={{ position: 'absolute', right: 16, top: 16, minHeight: 34, padding: 8 }}
          aria-label="Close AI match modal"
        >
          <X size={17} />
        </button>

        <div className="page-kicker"><Sparkles size={16} /> AI-assisted introduction</div>
        <h2 style={{ fontSize: '1.8rem', marginTop: 8, marginBottom: 20 }}>
          Review before sending match
        </h2>

        <div className="grid grid-2 mb-6">
          {[profile, match].map((person) => (
            <div key={person.id} className="quick-card flex items-center gap-3">
              <img src={person.profilePhoto} alt={person.firstName} style={{ width: 62, height: 62, borderRadius: 16, objectFit: 'cover' }} />
              <div className="min-w-0">
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900 }} className="truncate">
                  {person.firstName} {person.lastName}
                </div>
                <div className="text-gray" style={{ fontSize: '0.82rem' }}>{person.age} yrs · {person.city}</div>
                <div className="text-gray-light truncate" style={{ fontSize: '0.78rem' }}>{person.designation}</div>
              </div>
            </div>
          ))}
        </div>

        {!aiResult ? (
          <div className="text-center" style={{ padding: '44px 0' }}>
            <Loader2 className="mx-auto mb-4" size={42} style={{ animation: 'spin 0.9s linear infinite' }} />
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900 }}>Analyzing compatibility</div>
            <p className="text-gray">Gemini is used when configured; otherwise the deterministic fallback keeps the MVP working.</p>
          </div>
        ) : (
          <div className="animate-slide-up">
            <div className="flex items-center gap-5 mb-6" style={{ flexWrap: 'wrap' }}>
              <div className="score-circle">
                <span className="score-value">{aiResult.score}</span>
              </div>
              <div className="flex-1">
                <div className="page-kicker">{aiResult.poweredBy}</div>
                <h3 style={{ fontSize: '1.5rem', marginTop: 6 }}>{aiResult.matchLabel}</h3>
                <p className="text-gray" style={{ marginTop: 8 }}>{aiResult.explanation}</p>
              </div>
            </div>

            <div className="grid grid-2 mb-6">
              <div className="quick-card">
                <div className="section-title"><Check size={17} /> Strengths</div>
                <div className="flex flex-col gap-2">
                  {(aiResult.strengths || []).map((strength) => (
                    <div key={strength} className="flex gap-2 text-sm text-gray">
                      <Check size={15} color="var(--sage)" /> {strength}
                    </div>
                  ))}
                </div>
              </div>
              <div className="quick-card">
                <div className="section-title"><AlertCircle size={17} /> To Discuss</div>
                <div className="flex flex-col gap-2">
                  {(aiResult.considerations || []).map((item) => (
                    <div key={item} className="flex gap-2 text-sm text-gray">
                      <AlertCircle size={15} color="var(--primary-dark)" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ai-explanation mb-6">
              <div className="section-title"><HeartHandshake size={17} /> Profile Fit Reasoning</div>
              {loadingExtra ? (
                <p className="text-gray">Generating deeper fit analysis...</p>
              ) : profileFit ? (
                <>
                  <strong style={{ color: 'var(--ink)' }}>{profileFit.overallFit}</strong>
                  <ul style={{ paddingLeft: 18, marginTop: 10 }}>
                    {profileFit.reasoning.map((reason) => (
                      <li key={reason} style={{ marginBottom: 6 }}>{reason}</li>
                    ))}
                  </ul>
                  <p style={{ marginTop: 10 }}><strong>Recommendation:</strong> {profileFit.recommendation}</p>
                </>
              ) : (
                <p className="text-gray">Fit reasoning was not available.</p>
              )}
            </div>

            <div className="ai-intro-box mb-8">
              <div className="row-label mb-3">Personalized intro email</div>
              <p>{aiResult.introSnippet}</p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={closeWithAnimation} className="btn-outline flex-1">Cancel</button>
              <button type="button" onClick={onConfirm} className="btn-primary flex-1">
                <Send size={16} /> Confirm and Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
