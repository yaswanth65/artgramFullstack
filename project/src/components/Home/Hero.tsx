import React from 'react';
import { ArrowRight, Palette, Users, Award,  Heart, Target } from 'lucide-react';
import {} from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <video
              className="w-full h-72 rounded-2xl object-cover shadow-2xl border-4 border-white"
              src="https://res.cloudinary.com/df2mieky2/video/upload/v1754938196/EVENTS_AT_ARTGRAM_v9yeol.mp4"
              autoPlay
              loop
              muted
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="font-black text-4xl mb-4 text-slate-800">
              ABOUT ARTGRAM
            </h2>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
              From Inspiration to Impact
            </h3>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              Artgram began with a dream — to make art accessible, joyful, and
              part of everyday life. What started as a small initiative has
              grown into a vibrant community, nurturing creativity across all
              ages.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              We believe that art is not just a hobby but a way to communicate,
              heal, and evolve. Through our programs and events, we've touched
              hundreds of lives, empowering individuals to create fearlessly.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            <p className="text-4xl font-bold text-orange-600">25,000+</p>
            <p className="text-gray-600 font-medium">Customers</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
            <p className="text-4xl font-bold text-orange-600">40+</p>
            <p className="text-gray-600 font-medium">Unique Designs</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
            <p className="text-4xl font-bold text-orange-600">100+</p>
            <p className="text-gray-600 font-medium">Birthday Parties</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            <p className="text-4xl font-bold text-orange-600">5</p>
            <p className="text-gray-600 font-medium">Studio Locations</p>
          </div>
        </div>
      </section>
  );
};

export default Hero;