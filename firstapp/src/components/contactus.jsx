import React, { useState } from 'react';
import './contactus.css'; // Make sure this file exists

function ContactUs() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.subject || !form.message) {
      alert('Please fill in all fields.');
      return;
    }

    console.log('Form submitted:', form);
    setSubmitted(true);
    setForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      {submitted && <p className="success-msg">Thanks for reaching out! We'll get back to you soon.</p>}
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          value={form.message}
          onChange={handleChange}
        />
        <button type="submit" className="submit-btn">Send Message</button>
      </form>
    </div>
  );
}

export default ContactUs;
