import React, { useState } from "react";
import "./faq.css";

const FAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const questions = [
    {
      question: "How do I apply for a loan?",
      answer:
        "You can apply through our website or mobile app by filling out the application form.",
    },
    {
      question: "What is the interest rate?",
      answer:
        "Our loan interest rate is 2% fixed throughout the repayment period.",
    },
    {
      question: "What are the repayment options?",
      answer: "We offer flexible repayment plans tailored to your needs.",
    },
  ];

  return (
    <div className="faq">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-items">
        {questions.map((item, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleQuestion(index)}>
              <h4>{item.question}</h4>
              <span>{activeQuestion === index ? "-" : "+"}</span>
            </div>
            {activeQuestion === index && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
