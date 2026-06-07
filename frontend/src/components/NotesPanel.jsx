import { useEffect, useState } from 'react';
import { FilePenLine } from 'lucide-react';
import { updateProfile } from '../lib/api';

export default function NotesPanel({ profileId, initialNotes }) {
  const [notes, setNotes] = useState(initialNotes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNotes(initialNotes || '');
  }, [initialNotes]);

  const handleBlur = async () => {
    if (notes === (initialNotes || '')) return;
    setSaving(true);
    try {
      await updateProfile(profileId, { notes });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error('Failed to save notes', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bio-card motion-section" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="bio-card-title" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px' }}>
        <div className="flex items-center gap-2"><FilePenLine size={20} /> Matchmaker Notes</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>
          {saving && <span className="text-gray-light">Saving...</span>}
          {saved && <span className="text-sage font-bold">Saved</span>}
        </div>
      </div>
      <p className="text-gray" style={{ fontSize: '0.9rem', marginBottom: 16 }}>
        Record quick context from calls, family preferences, objections, or follow-up reminders.
      </p>
      <textarea
        className="notes-textarea"
        style={{ flex: 1, minHeight: '180px', padding: '16px', resize: 'vertical' }}
        placeholder="Add call notes, family constraints, deal-breakers, or next action..."
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
}
