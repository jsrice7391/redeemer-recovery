import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './comps/LoginButton';
import Dashboard from './pages/Dashboard';
import FindGroups from './pages/FindGroups';
import StartGroup from './pages/StartGroup';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function Home() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="logo">
            Redeemer <span className="logo-accent">Recovery</span>
          </div>
          <div className="nav-links">
            <a href="/" className="nav-link">Home</a>
            <a href="/find-groups" className="nav-link">Find Groups</a>
            <a href="/start-group" className="nav-link">Start a Group</a>
            <LoginButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-eyebrow">Find Hope & Healing</div>
          <h1 className="hero-title">
            Your Journey to <span className="hero-title-gradient">Redemption</span> Starts Here
          </h1>
          <p className="hero-subtitle">
            Christ-centered recovery groups that support and empower individuals
            struggling with addiction to find freedom, purpose, and lasting transformation.
          </p>
          <div className="hero-cta-group">
            <a href="/find-groups" className="cta-primary">Find a Group Near You</a>
            <a href="/start-group" className="cta-secondary">Start a Group</a>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission">
        <div className="mission-container">
          <div className="section-label">Our Foundation</div>
          <h2 className="section-title">Built on Faith, Hope & Community</h2>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">✝️</div>
              <h3 className="value-title">Christ-Centered</h3>
              <p className="value-description">
                Every recovery journey is grounded in the transformative power of Christ's
                love and grace, providing spiritual strength and purpose.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3 className="value-title">Community Support</h3>
              <p className="value-description">
                Connect with others who understand your struggles in a safe, judgment-free
                environment where authentic healing happens together.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🌅</div>
              <h3 className="value-title">Lasting Freedom</h3>
              <p className="value-description">
                Experience true liberation from addiction through proven recovery principles,
                biblical truth, and unwavering support every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="services-container">
          <div className="section-label">How We Help</div>
          <h2 className="section-title">Your Path to Recovery</h2>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-number">1</div>
              <h3 className="service-title">Find Your Group</h3>
              <p className="service-description">
                Discover a recovery group in your area led by trained facilitators
                who care about your journey.
              </p>
            </div>

            <div className="service-card">
              <div className="service-number">2</div>
              <h3 className="service-title">Start Your Journey</h3>
              <p className="service-description">
                Begin attending weekly meetings where you'll find fellowship,
                accountability, and biblical guidance.
              </p>
            </div>

            <div className="service-card">
              <div className="service-number">3</div>
              <h3 className="service-title">Experience Freedom</h3>
              <p className="service-description">
                Walk towards lasting recovery through Christ-centered principles
                and a supportive community.
              </p>
            </div>

            <div className="service-card">
              <div className="service-number">4</div>
              <h3 className="service-title">Give Back</h3>
              <p className="service-description">
                Once healed, help others find hope by sharing your story and
                supporting new members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">You Don't Have to Walk This Path Alone</h2>
          <p className="cta-subtitle">
            Join thousands who have found freedom from addiction through faith, community,
            and the life-changing power of redemption.
          </p>
          <a href="/find-groups" className="cta-white">Get Started Today</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">Redeemer Recovery</div>
          <p className="footer-text">
            Coordinating Christ-based recovery groups to bring hope and healing to those
            struggling with addiction.
          </p>
          <div className="footer-divider"></div>
          <p className="footer-bottom">
            © {new Date().getFullYear()} Redeemer Recovery. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const { error } = useAuth0();

  if (error) {
    return (
      <div className="app-container">
        <div className="error-state">
          <div className="error-title">Oops!</div>
          <div className="error-message">Something went wrong</div>
          <div className="error-sub-message">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-groups" element={<FindGroups />} />
        <Route path="/start-group" element={<StartGroup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
