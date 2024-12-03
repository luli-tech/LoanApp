import React, { useState, useEffect } from "react";
import "./homepage.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  let navigate = useNavigate();
  // Safely retrieve ActiveUser from Redux
  const { ActiveUser } = useSelector(
    (state) => state.user || { ActiveUser: null }
  );
  useEffect(() => {
    ActiveUser;
  }, [ActiveUser]);

  function apply() {
    if (ActiveUser) {
      navigate("/spin")
      setTimeout(() => { navigate("/terms") }, 1000)

    } else {
      navigate("/spin")
      setTimeout(() => navigate("/login"), 10000)

    }
  }

  useEffect(() => {
    console.log(ActiveUser);
  }, [ActiveUser]); // Logs ActiveUser whenever it changes

  const handleToggleQuestion = (index) => {
    setActiveQuestion((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          {/* Safely render content based on ActiveUser */}
          {ActiveUser?.isAuthenticated && <h1>Welcome, {ActiveUser?.name}!</h1>}
          <h1 className="hero-title">Your Trusted Partner in Finance</h1>
          <p className="hero-subtitle">
            Unlock low-interest loans with ease and flexibility. Banking made
            simple.
          </p>
          <div className="cta-buttons">
            <button onClick={apply} className="cta-primary">
              Apply Now
            </button>
            <button className="cta-secondary">Learn More</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Transparent Rates</h3>
            <p>Enjoy a fixed 2% interest rate without hidden charges.</p>
          </div>
          <div className="feature-card">
            <h3>Fast Processing</h3>
            <p>Get your loan approved in less than 24 hours.</p>
          </div>
          <div className="feature-card">
            <h3>Customizable Plans</h3>
            <p>Flexible repayment options tailored to your needs.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2 className="section-title">What Our Clients Say</h2>
        <div className="testimonial-carousel">
          <div className="testimonial">
            <p>
              "The 2% interest rate and quick approval process saved me during
              an emergency!"
            </p>
            <h4>- Alex Johnson</h4>
          </div>
          <div className="testimonial">
            <p>
              "Flexible terms and exceptional customer support. Highly
              recommended!"
            </p>
            <h4>- Emily Clark</h4>
          </div>
          <div className="testimonial">
            <p>
              "Getting a loan through LoanApp was fast and easy. Definitely
              recommend to anyone!"
            </p>
            <h4>- John Doe</h4>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-items">
          {[
            "How do I apply for a loan?",
            "What is the interest rate?",
            "What are the repayment options?",
          ].map((question, index) => (
            <div className="faq-item" key={index}>
              <div
                className="faq-question"
                onClick={() => handleToggleQuestion(index)}
              >
                <h4>{question}</h4>
                <span>{activeQuestion === index ? "-" : "+"}</span>
              </div>
              {activeQuestion === index && (
                <div className="faq-answer">
                  <p>
                    This is where the answer will go. Example: You can apply
                    through our website or mobile app.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <h2>Let’s Help You Get Started</h2>
        <button className="cta-footer">Apply for a Loan</button>
        <p>&copy; 2024 LoanApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
