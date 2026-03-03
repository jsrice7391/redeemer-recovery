import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { userApi, CreateUserDto } from '../api/userApi';
import {
  dashboardApi,
  UserGroupEntry,
  UserStep,
  ScheduleItem,
  Facilitator,
} from '../api/dashboardApi';
import LogoutButton from '../comps/LogoutButton';

const STEP_TITLES: Record<number, string> = {
  1: 'Admit Powerlessness',
  2: 'Believe in a Higher Power',
  3: 'Turn Will Over to God',
  4: 'Take a Moral Inventory',
  5: 'Admit Wrongs to God & Others',
  6: 'Ready for God to Remove Defects',
  7: 'Humbly Ask God to Remove Shortcomings',
  8: 'Make a List of Those Harmed',
  9: 'Make Amends Where Possible',
  10: 'Continue Personal Inventory',
  11: 'Seek God Through Prayer & Meditation',
  12: 'Carry the Message & Practice Principles',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const Dashboard = () => {
  const { user, isLoading: auth0Loading } = useAuth0();
  const [groups, setGroups] = useState<UserGroupEntry[]>([]);
  const [step, setStep] = useState<UserStep | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [contact, setContact] = useState<Facilitator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        // Fetch or create backend user
        let bu = await userApi.getUserByEmail(user.email);
        if (!bu) {
          const dto: CreateUserDto = { name: user.name || user.email, email: user.email };
          bu = await userApi.createUser(dto);
        }
        // Load dashboard data in parallel
        const [grps, stp, sched, cont] = await Promise.all([
          dashboardApi.getUserGroups(bu.id),
          dashboardApi.getUserStep(bu.id),
          dashboardApi.getUserSchedule(bu.id),
          dashboardApi.getUserContact(bu.id),
        ]);
        setGroups(grps);
        setStep(stp);
        setSchedule(sched);
        setContact(cont);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user]);

  if (auth0Loading || loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <p className="loading-text" style={{ color: '#e53e3e' }}>{error}</p>
      </div>
    );
  }

  const firstName = user?.name?.split(' ')[0] || user?.email || 'Friend';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="db-page">
      {/* Top Nav */}
      <nav className="db-nav">
        <div className="db-nav-inner">
          <div className="logo">
            Redeemer <span className="logo-accent">Recovery</span>
          </div>
          <div className="db-nav-right">
            <div className="db-avatar">
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className="db-avatar-img" />
              ) : (
                <span>{getInitials(user?.name || 'U')}</span>
              )}
            </div>
            <span className="db-nav-name">{user?.name}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="db-main">
        {/* Welcome Header */}
        <div className="db-welcome">
          <div>
            <h1 className="db-welcome-title">Welcome back, {firstName}!</h1>
            <p className="db-welcome-date">{today}</p>
          </div>
        </div>

        {/* Current Step — full width */}
        <div className="db-step-card">
          <div className="db-step-header">
            <div className="db-step-badge">Step {step?.stepNumber ?? '—'} of 12</div>
            <span className="db-step-started">
              {step ? `Started ${formatDate(step.startedAt)}` : 'No step set'}
            </span>
          </div>
          <h2 className="db-step-title">
            {step ? STEP_TITLES[step.stepNumber] ?? `Step ${step.stepNumber}` : 'Your Recovery Step'}
          </h2>
          {step && (
            <>
              <div className="db-progress-bar-track">
                <div
                  className="db-progress-bar-fill"
                  style={{ width: `${((step.stepNumber) / 12) * 100}%` }}
                />
              </div>
              <div className="db-progress-label">
                {step.stepNumber} / 12 steps complete
              </div>
            </>
          )}
          {step?.note && <p className="db-step-note">{step.note}</p>}
          {!step && (
            <p className="db-empty-hint">
              Your facilitator will set your current step — check back soon.
            </p>
          )}
        </div>

        {/* Two-column grid */}
        <div className="db-grid">
          {/* Left — My Groups */}
          <div className="db-section">
            <h2 className="db-section-title">My Groups</h2>
            {groups.length === 0 ? (
              <div className="db-empty-card">
                <div className="db-empty-icon">👥</div>
                <p className="db-empty-text">You haven't joined any groups yet.</p>
                <a href="/find-groups" className="db-empty-link">Find a group near you</a>
              </div>
            ) : (
              <div className="db-groups-list">
                {groups.map((ug) => (
                  <div key={ug.id} className="db-group-card">
                    <div className="db-group-card-top">
                      <div>
                        <span className="db-focus-badge">{ug.group.focusArea}</span>
                        {ug.isPrimary && <span className="db-primary-badge">Primary</span>}
                      </div>
                      <h3 className="db-group-name">{ug.group.name}</h3>
                    </div>
                    <div className="db-group-meta">
                      <div className="db-meta-row">
                        <span className="db-meta-icon">📅</span>
                        <span>{ug.group.meetingDay}s at {ug.group.meetingTime}</span>
                      </div>
                      <div className="db-meta-row">
                        <span className="db-meta-icon">📍</span>
                        <span>{ug.group.location}, {ug.group.city}, {ug.group.state}</span>
                      </div>
                      {ug.group.facilitator && (
                        <div className="db-meta-row">
                          <span className="db-meta-icon">👤</span>
                          <span>Led by {ug.group.facilitator.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — Schedule + Contact stacked */}
          <div className="db-right-col">
            {/* Upcoming Meetings */}
            <div className="db-section">
              <h2 className="db-section-title">Upcoming Meetings</h2>
              {schedule.length === 0 ? (
                <div className="db-empty-card">
                  <div className="db-empty-icon">📆</div>
                  <p className="db-empty-text">No upcoming meetings.</p>
                </div>
              ) : (
                <div className="db-schedule-list">
                  {schedule.map((item) => (
                    <div key={item.groupId} className="db-schedule-item">
                      <div className="db-schedule-date-col">
                        <span className="db-schedule-day">
                          {new Date(item.nextDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="db-schedule-num">
                          {new Date(item.nextDate + 'T00:00:00').getDate()}
                        </span>
                      </div>
                      <div className="db-schedule-info">
                        <div className="db-schedule-name">{item.groupName}</div>
                        <div className="db-schedule-meta">
                          {item.meetingTime} · {item.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Main Contact */}
            <div className="db-section">
              <h2 className="db-section-title">Main Contact</h2>
              {!contact ? (
                <div className="db-empty-card">
                  <div className="db-empty-icon">📞</div>
                  <p className="db-empty-text">No facilitator assigned yet.</p>
                </div>
              ) : (
                <div className="db-contact-card">
                  <div className="db-contact-avatar">{getInitials(contact.name)}</div>
                  <div className="db-contact-info">
                    <div className="db-contact-name">{contact.name}</div>
                    <div className="db-contact-role">{contact.role}</div>
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="db-contact-detail">
                        📞 {contact.phone}
                      </a>
                    )}
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="db-contact-detail">
                        ✉️ {contact.email}
                      </a>
                    )}
                    {contact.availability && (
                      <div className="db-contact-detail">🕐 {contact.availability}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
