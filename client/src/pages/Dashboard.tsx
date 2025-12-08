import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { userApi, User as BackendUser, CreateUserDto } from '../api/userApi';
import LogoutButton from '../comps/LogoutButton';

const Dashboard = () => {
  const { user, isLoading: auth0Loading } = useAuth0();
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrCreateUser = async () => {
      if (!user || !user.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let existingUser = await userApi.getUserByEmail(user.email);

        if (!existingUser) {
          const newUserData: CreateUserDto = {
            name: user.name || user.email,
            email: user.email,
          };
          existingUser = await userApi.createUser(newUserData);
        }

        setBackendUser(existingUser);
      } catch (err) {
        console.error('Error fetching/creating user:', err);
        setError('Failed to load user data from server');
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateUser();
  }, [user]);

  if (auth0Loading || loading) {
    return (
      <div className="app-container">
        <div className="loading-state">
          <div className="loading-text">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-state">
          <div className="error-title">Error</div>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-card-wrapper">
        <h1 className="main-title">Dashboard</h1>

        <div className="logged-in-section">
          <div className="logged-in-message">Welcome to your dashboard!</div>

          <h2 className="profile-section-title">Auth0 Profile</h2>
          <div className="profile-card">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <img
                src={user?.picture || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110' viewBox='0 0 110 110'%3E%3Ccircle cx='55' cy='55' r='55' fill='%2363b3ed'/%3E%3Cpath d='M55 50c8.28 0 15-6.72 15-15s-6.72-15-15-15-15 6.72-15 15 6.72 15 15 15zm0 7.5c-10 0-30 5.02-30 15v3.75c0 2.07 1.68 3.75 3.75 3.75h52.5c2.07 0 3.75-1.68 3.75-3.75V72.5c0-9.98-20-15-30-15z' fill='%23fff'/%3E%3C/svg%3E`}
                alt={user?.name || 'User'}
                className="profile-picture"
                style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #63b3ed'
                }}
              />
              <div style={{ textAlign: 'center' }}>
                <div className="profile-name" style={{ fontSize: '2rem', fontWeight: '600', color: '#f7fafc', marginBottom: '0.5rem' }}>
                  {user?.name}
                </div>
                <div className="profile-email" style={{ fontSize: '1.15rem', color: '#a0aec0' }}>
                  {user?.email}
                </div>
              </div>
            </div>
          </div>

          {backendUser && (
            <>
              <h2 className="profile-section-title" style={{ marginTop: '2rem' }}>Server Data</h2>
              <div className="profile-card">
                <div style={{ color: '#f7fafc' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#63b3ed' }}>User ID:</strong> {backendUser.id}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#63b3ed' }}>Name:</strong> {backendUser.name}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#63b3ed' }}>Email:</strong> {backendUser.email}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#63b3ed' }}>Created:</strong>{' '}
                    {new Date(backendUser.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <strong style={{ color: '#63b3ed' }}>Last Updated:</strong>{' '}
                    {new Date(backendUser.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </>
          )}

          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
