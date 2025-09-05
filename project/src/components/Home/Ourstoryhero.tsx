import React from 'react';
import { ArrowRight, Palette, Users, Award } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 to-pink-50 py-20">
           <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight text-center mb-12">
                <span className="text-purple-500 block">Our Story</span>
              </h1>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex flex-col lg:flex-row items-stretch gap-0 lg:gap-8 border rounded-xl shadow-lg overflow-hidden bg-white">
          <div className="w-full lg:w-[380px] flex-shrink-0 flex items-center justify-center bg-gray-100 p-0">
            <img
              src="https://res.cloudinary.com/df2mieky2/image/upload/q_auto,f_auto,w_600/v1754830108/Screenshot_2025-08-10_181702_urntu7.png"
              alt="Art and Craft Studio"
              className="rounded-none w-full h-full object-cover"
              style={{ maxHeight: '100%', minHeight: '320px', maxWidth: '380px' }}
            />
          </div>
          <div className="flex-1 p-8 flex flex-col justify-center">
            <p className="text-xl text-gray-700 leading-relaxed text-justify mb-4">
              Artgram was founded by Shwetha and Hema, two co-sisters with a shared passion for creativity and artistic expression. Shwetha, with a background in architecture and a deep love for art, was searching for engaging and creative spaces for children in Vijayawada - beyond malls and movies. This simple idea sparked the vision for Artgram, a space where art comes to life through immersive, hands-on experiences.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed text-justify">
              What began as a small initiative soon blossomed into a thriving creative hub, expanding to multiple cities with overwhelming love and acceptance from our community. Today, Artgram continues to inspire people of all ages, offering a vibrant space to explore, create, and celebrate the joy of art.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;