import { useEffect } from 'react';
import gsap from 'gsap';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.to('.toast', {
        y: 18,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: onClose,
      });
    }, 3800);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast animate-slide-up">
      <div className="card px-6 py-4 flex items-center gap-3" style={{ borderColor: '#cae8d5' }}>
        <CheckCircle2 size={24} color="var(--sage)" />
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900 }}>{message}</div>
          <div className="text-gray-light" style={{ fontSize: '0.78rem' }}>Mock email action completed</div>
        </div>
      </div>
    </div>
  );
}
