import React, { useState } from 'react';
import './contactus.css'; // Make sure this file exists
import Footer from './footer';
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

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.email || !form.subject || !form.message) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    const response = await fetch('https://snatchd.pythonanywhere.com/api', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    console.log("Server response:", data);

    if (data.success) {
      setSubmitted(true);
      alert("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      alert("Failed to send message. Please try again later.");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Error sending message. Please check your backend connection.");
  }
};

  return (
  <>
    <div className="contact-container">
      <h2>Contact Us</h2>

      {submitted && (
        <p className="success-msg">
          Thanks for reaching out! We'll get back to you soon.
        </p>
      )}

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

    <Footer />
  </>
);

}

export default ContactUs;
