import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';

function StartGroup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CALENDLY_URL = 'https://calendly.com/your-calendly-link'; // Replace with actual Calendly link

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.city) {
      alert('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    // Here you could save the data to your backend if needed
    // For now, we'll just redirect to Calendly
    try {
      // Optional: Send form data to backend
      // await axios.post(`${API_URL}/api/group-leaders`, formData);

      // Redirect to Calendly with prefilled data
      const calendlyParams = new URLSearchParams({
        name: formData.name,
        email: formData.email,
        a1: formData.city, // Custom field for city
      });

      window.location.href = `${CALENDLY_URL}?${calendlyParams.toString()}`;
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="start-group-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link to="/" className="logo">
            Redeemer <span className="logo-accent">Recovery</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/find-groups" className="nav-link">Find Groups</Link>
            <Link to="/start-group" className="nav-link active">Start a Group</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="find-hero">
        <div className="find-hero-container">
          <h1 className="find-hero-title">
            Start Your Own <span className="hero-title-gradient">Recovery Group</span>
          </h1>
          <p className="find-hero-subtitle">
            Help bring hope and healing to your community by leading a Christ-centered recovery group.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-card">
            <div className="search-header">
              <h2 className="search-title">Let's Get Started</h2>
              <p className="search-description">
                Fill out the form below and schedule an introduction call to learn more about starting a recovery group in your area.
              </p>
            </div>

            <form className="search-form" onSubmit={handleSubmit}>
              <div className="search-row" style={{ flexDirection: 'column' }}>
                <div className="search-field" style={{ width: '100%' }}>
                  <label className="search-label">Full Name *</label>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="John Doe"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="search-field" style={{ width: '100%' }}>
                  <label className="search-label">Email Address *</label>
                  <input
                    type="email"
                    className="search-input"
                    placeholder="john.doe@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="search-field" style={{ width: '100%' }}>
                  <label className="search-label">City *</label>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Your City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="search-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner" style={{ width: '20px', height: '20px', marginRight: '10px' }}></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="search-icon">📅</span>
                    Schedule Introduction Call
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="services">
        <div className="services-container">
          <div className="section-label">What to Expect</div>
          <h2 className="section-title">Next Steps</h2>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-number">1</div>
              <h3 className="service-title">Introduction Call</h3>
              <p className="service-description">
                Schedule a 30-minute call to discuss your vision and learn about our group leader program.
              </p>
            </div>

            <div className="service-card">
              <div className="service-number">2</div>
              <h3 className="service-title">Training & Support</h3>
              <p className="service-description">
                Receive comprehensive training and ongoing support to effectively lead your recovery group.
              </p>
            </div>

            <div className="service-card">
              <div className="service-number">3</div>
              <h3 className="service-title">Launch Your Group</h3>
              <p className="service-description">
                Get assistance with logistics, materials, and promotion to successfully launch your group.
              </p>
            </div>

            <div className="service-card">
              <div className="service-number">4</div>
              <h3 className="service-title">Impact Lives</h3>
              <p className="service-description">
                Make a lasting difference in your community by helping others find freedom through Christ.
              </p>
            </div>
          </div>
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

export default StartGroup;
