import React, { useEffect, useState } from 'react';

import Main from './main';
import Hero from './hero';
import Hero2 from './hero2';
import Footer from './footer';


function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/home')
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
    </div>
  );
}

export default Home;
