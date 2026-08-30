import { useMemo } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const PROFILE_FIELDS = [
  { key: 'fullName',   label: 'Full Name',    weight: 1 },
  { key: 'phone',      label: 'Phone Number', weight: 1 },
  { key: 'village',    label: 'Village',       weight: 1 },
  { key: 'district',   label: 'District',      weight: 1 },
  { key: 'state',      label: 'State',         weight: 1 },
  { key: 'cropsGrown', label: 'Crops Grown',   weight: 1 },
];

function isFieldFilled(user, key) {
  const value = user?.[key];
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

export function useProfileCompletion(user) {
  return useMemo(() => {
    const totalWeight = PROFILE_FIELDS.reduce((sum, f) => sum + f.weight, 0);
    let filledWeight = 0;
    const filled = [];
    const missing = [];

    PROFILE_FIELDS.forEach((field) => {
      if (isFieldFilled(user, field.key)) {
        filledWeight += field.weight;
        filled.push(field);
      } else {
        missing.push(field);
      }
    });

    const percentage = Math.round((filledWeight / totalWeight) * 100);
    return { percentage, filled, missing, total: PROFILE_FIELDS.length };
  }, [user]);
}

// SVG circular progress ring
function ProgressRing({ percentage, size = 100, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Color based on percentage
  const getColor = (pct) => {
    if (pct >= 100) return '#16a34a'; // green-600
    if (pct >= 75)  return '#65a30d'; // lime-600
    if (pct >= 50)  return '#d97706'; // amber-600
    return '#dc2626';                  // red-600
  };

  const color = getColor(percentage);

  return (
    <div className="profile-ring-container" style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Foreground arc */}
        <circle
          className="profile-ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease',
          }}
        />
      </svg>
      {/* Center label */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          className="profile-ring-pct"
          style={{
            fontSize: size * 0.28,
            fontWeight: 800,
            lineHeight: 1,
            color,
            transition: 'color 0.5s ease',
          }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export default function ProfileCompletion({ user, onEditClick }) {
  const { percentage, missing } = useProfileCompletion(user);

  if (percentage === 100) {
    return (
      <div className="profile-completion-card profile-completion-complete">
        <style>{profileCompletionStyles}</style>
        <div className="pc-row">
          <ProgressRing percentage={100} size={72} strokeWidth={6} />
          <div className="pc-text">
            <h3 className="pc-title pc-title-complete">
              <CheckCircle2 size={20} style={{ color: '#16a34a', flexShrink: 0 }} />
              Profile Complete!
            </h3>
            <p className="pc-subtitle">All your profile information has been filled in.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-completion-card">
      <style>{profileCompletionStyles}</style>
      <div className="pc-row">
        <ProgressRing percentage={percentage} size={72} strokeWidth={6} />
        <div className="pc-text">
          <h3 className="pc-title">
            <AlertCircle size={18} style={{ color: '#d97706', flexShrink: 0 }} />
            Profile {percentage}% Complete
          </h3>
          <p className="pc-subtitle">
            Complete your profile to get personalised recommendations.
          </p>
        </div>
      </div>

      {/* Missing fields */}
      <div className="pc-missing">
        <p className="pc-missing-label">Missing information:</p>
        <div className="pc-chips">
          {missing.map((field) => (
            <button
              key={field.key}
              type="button"
              onClick={onEditClick}
              className="pc-chip"
              title={`Add ${field.label}`}
            >
              <span className="pc-chip-dot" />
              {field.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Scoped styles ---------- */
const profileCompletionStyles = `
  .profile-completion-card {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fef9c3 100%);
    border: 1px solid #fbbf24;
    border-radius: 14px;
    padding: 20px;
    animation: pcSlideIn 0.5s ease-out;
  }

  .profile-completion-complete {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #d1fae5 100%);
    border-color: #86efac;
  }

  .pc-row {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .pc-text {
    flex: 1;
    min-width: 0;
  }

  .pc-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.05rem;
    font-weight: 700;
    color: #92400e;
    margin: 0 0 4px 0;
  }

  .pc-title-complete {
    color: #166534;
  }

  .pc-subtitle {
    font-size: 0.85rem;
    color: #78716c;
    margin: 0;
    line-height: 1.4;
  }

  .pc-missing {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px dashed #fbbf24;
  }

  .profile-completion-complete .pc-missing {
    border-top-color: #86efac;
  }

  .pc-missing-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #a8a29e;
    margin: 0 0 10px 0;
  }

  .pc-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .pc-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #92400e;
    background: rgba(251, 191, 36, 0.18);
    border: 1px solid rgba(251, 191, 36, 0.35);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .pc-chip:hover {
    background: rgba(251, 191, 36, 0.35);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.25);
  }

  .pc-chip-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f59e0b;
    flex-shrink: 0;
  }

  @keyframes pcSlideIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
