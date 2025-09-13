import React, { useEffect, useState } from 'react';

import Main from './main';
import Hero from './hero';
import Hero2 from './hero2';
import Footer from './footer';

function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('https://whimsyjewels.pythonanywhere.com/api/home')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(console.error);
  }, []);

  return (
    <div>
      <Main />
      <Hero />
      <Hero2 />
      <Footer />
      {/* Optionally display message somewhere */}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Home;
