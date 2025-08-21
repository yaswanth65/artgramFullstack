import React from 'react';
import Carousel from '../components/Home/Carousel';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Testimonials from '../components/Home/Testimonials';
import Studios from '../components/Home/Studios';

const Home: React.FC = () => {
  return (
    <div>
      <Carousel />
      <Hero />
      <Features />
      
      <Testimonials />
      <Studios />
   
    </div>
  );
};

export default Home;