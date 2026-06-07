import { useState } from 'react';
import { updateProfile } from '../lib/api';

export default function StatusChanger({ profileId, initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const statuses = ['New Lead', 'In Progress', 'Match Sent', 'Paused', 'Closed'];

  const getStatusClass = (s) => {
    switch (s) {
      case 'New Lead': return 'tag-new';
      case 'In Progress': return 'tag-progress';
      case 'Match Sent': return 'tag-matched';
      case 'Paused': return 'tag-paused';
      default: return 'tag-closed';
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) return;
    setLoading(true);
    try {
      await updateProfile(profileId, { status: newStatus });
      setStatus(newStatus);
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-pills flex gap-2" style={{ flexWrap: 'wrap' }}>
      {statuses.map(s => (
        <button
          key={s}
          onClick={() => handleStatusChange(s)}
          disabled={loading}
          className={`tag ${getStatusClass(s)} ${status === s ? 'active' : ''}`}
          style={{ opacity: status === s ? 1 : 0.4, cursor: 'pointer', border: status === s ? '2px solid var(--ink)' : 'none' }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
