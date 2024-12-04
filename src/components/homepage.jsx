import React, { useState, useEffect } from "react";
import "./homepage.css";
import { useSelector } from "react-redux";
import { Typed } from "react-typed";
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Typewriter from "./typewriter";

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

      setTimeout(() => { navigate("/terms") }, 1000)

    } else {

      setTimeout(() => navigate("/login"), 10000)

    }
  }

  useEffect(() => {
    console.log(ActiveUser);
  }, [ActiveUser]); // Logs ActiveUser whenever it changes

  const handleToggleQuestion = (index) => {
    setActiveQuestion((prevIndex) => (prevIndex === index ? null : index));
  };
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      textAlign: "center",
      fontSize: "2rem",
      fontFamily: "Arial, sans-serif",
    },
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section data-aos='fade-in' className="hero">
        <div className="hero-content">
          {ActiveUser?.isAuthenticated && <h1>Welcome, {ActiveUser?.name}!</h1>}
          <Typewriter name={ActiveUser?.name} />
          <p data-aos='fade-down' className="hero-subtitle">
            Unlock low-interest loans with ease and flexibility. Banking made
            simple.
          </p>
          <div className="cta-buttons">
            <button data-aos='fade-left' onClick={apply} className="cta-primary">
              Apply Now
            </button>
            <button data-aos='fade-right' className="cta-secondary">Learn More</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 data-aos='fade-up' className="section-title">Why Choose Us?</h2>
        <div className="feature-cards">
          <div data-aos='fade-up' className="feature-card">
            <h3>Transparent Rates</h3>
            <p>Enjoy a fixed 2% interest rate without hidden charges.</p>
          </div>
          <div data-aos='fade-left' className="feature-card">
            <h3>Fast Processing</h3>
            <p>Get your loan approved in less than 24 hours.</p>
          </div>
          <div data-aos='fade-right' className="feature-card">
            <h3>Customizable Plans</h3>
            <p>Flexible repayment options tailored to your needs.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2 data-aos='fade-left' className="section-title">What Our Clients Say</h2>
        <div className="testimonial-carousel">
          <div data-aos='fade-up' className="testimonial">
            <p>
              "The 2% interest rate and quick approval process saved me during
              an emergency!"
            </p>
            <h4>- Alex Johnson</h4>
          </div>
          <div data-aos='fade-up' className="testimonial">
            <p>
              "Flexible terms and exceptional customer support. Highly
              recommended!"
            </p>
            <h4>- Emily Clark</h4>
          </div>
          <div data-aos='fade-up' className="testimonial">
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
        <h2 data-aos='fade-down' className="section-title">Frequently Asked Questions</h2>
        <div className="faq-items">
          {[
            "How do I apply for a loan?",
            "What is the interest rate?",
            "What are the repayment options?",
          ].map((question, index) => (
            <div data-aos='fade-right' className="faq-item" key={index}>
              <div
                className="faq-question"
                onClick={() => handleToggleQuestion(index)}
              >
                <h4>{question}</h4>
                <span>{activeQuestion === index ? "-" : "+"}</span>
              </div>
              {activeQuestion === index && (
                <div className="faq-answer">
                  <p data-aos='fade-left'>
                    You can apply through our website or mobile app.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer data-aos='fade-up' className="footer">
        <h2 data-aos='fade-down'>Let’s Help You Get Started</h2>
        <button data-aos='fade-left' className="cta-footer">Apply for a Loan</button>
        <p data-aos='fade-right'>&copy; 2024 LoanApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
