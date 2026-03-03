import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Group {
  id: number;
  name: string;
  location: string;
  city: string;
  state: string;
  zipCode: string;
  meetingDay: string;
  meetingTime: string;
  focusArea: string;
  description: string;
  facilitator: string;
  address: string;
}

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

function FindGroups() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFocus, setSelectedFocus] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/groups`);
      setFilteredGroups(response.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('searchTerm', searchTerm);
      if (selectedFocus !== 'all') params.append('focusArea', selectedFocus);
      if (selectedDay !== 'all') params.append('meetingDay', selectedDay);

      const response = await axios.get(`${API_URL}/api/groups?${params.toString()}`);
      setFilteredGroups(response.data);
    } catch (err) {
      console.error('Error searching groups:', err);
      setError('Failed to search groups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="find-groups-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link to="/" className="logo">
            Redeemer <span className="logo-accent">Recovery</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/find-groups" className="nav-link active">Find Groups</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="find-hero">
        <div className="find-hero-container">
          <h1 className="find-hero-title">Find Your <span className="hero-title-gradient">Recovery Group</span></h1>
          <p className="find-hero-subtitle">
            Connect with a Christ-centered recovery group in your area and take the first step toward freedom.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-card">
            <div className="search-header">
              <h2 className="search-title">Search for Groups</h2>
              <p className="search-description">Enter your location to find nearby recovery groups</p>
            </div>

            <div className="search-form">
              <div className="search-row">
                <div className="search-field">
                  <label className="search-label">Location</label>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="City, State, or ZIP Code"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <div className="search-field">
                  <label className="search-label">Focus Area</label>
                  <select
                    className="search-select"
                    value={selectedFocus}
                    onChange={(e) => setSelectedFocus(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="Substance Abuse">Substance Abuse</option>
                    <option value="Alcohol Addiction">Alcohol Addiction</option>
                    <option value="Drug Addiction">Drug Addiction</option>
                    <option value="General Addiction">General Addiction</option>
                  </select>
                </div>

                <div className="search-field">
                  <label className="search-label">Meeting Day</label>
                  <select
                    className="search-select"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                  >
                    <option value="all">Any Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
              </div>

              <button className="search-button" onClick={handleSearch}>
                <span className="search-icon">🔍</span>
                Search Groups
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="results-section">
        <div className="results-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading groups...</p>
            </div>
          ) : error ? (
            <div className="no-results">
              <div className="no-results-icon">⚠️</div>
              <h3 className="no-results-title">Error</h3>
              <p className="no-results-text">{error}</p>
              <button className="cta-primary" onClick={fetchGroups} style={{ marginTop: '2rem' }}>
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h2 className="results-title">
                  {filteredGroups.length} {filteredGroups.length === 1 ? 'Group' : 'Groups'} Found
                </h2>
                {searchTerm && (
                  <p className="results-subtitle">
                    Showing results for "{searchTerm}"
                  </p>
                )}
              </div>

              <div className="groups-grid">
                {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <div key={group.id} className="group-card">
                  <div className="group-header">
                    <div className="group-badge">{group.focusArea}</div>
                    <h3 className="group-name">{group.name}</h3>
                  </div>

                  <div className="group-body">
                    <div className="group-info-row">
                      <span className="group-icon">📍</span>
                      <div className="group-info">
                        <div className="group-location">{group.location}</div>
                        <div className="group-address">{group.address}</div>
                      </div>
                    </div>

                    <div className="group-info-row">
                      <span className="group-icon">🗓️</span>
                      <div className="group-info">
                        <div className="group-schedule">
                          {group.meetingDay}s at {group.meetingTime}
                        </div>
                      </div>
                    </div>

                    <div className="group-info-row">
                      <span className="group-icon">👤</span>
                      <div className="group-info">
                        <div className="group-facilitator">Facilitator: {group.facilitator}</div>
                      </div>
                    </div>

                    <p className="group-description">{group.description}</p>
                  </div>

                  <div className="group-footer">
                    <button className="group-contact-button">Contact Group</button>
                    <button className="group-directions-button">Get Directions</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3 className="no-results-title">No Groups Found</h3>
                <p className="no-results-text">
                  Try adjusting your search criteria or expanding your search area.
                </p>
              </div>
            )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="find-cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Don't See a Group Near You?</h2>
          <p className="cta-subtitle">
            We're always looking to expand our network. Contact us to start a recovery group in your community.
          </p>
          <Link to="/start-group" className="cta-white">Start a Group</Link>
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

export default FindGroups;
