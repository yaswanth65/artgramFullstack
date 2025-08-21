import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Users, Award, Heart, Target } from 'lucide-react';

const About: React.FC = () => {
  const { cmsContent } = useData();
  const aboutContent = cmsContent.find(c => c.type === 'about' && c.isActive);
  const aboutImages = aboutContent?.images || ['https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg'];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {aboutContent?.title || 'About Craft Factory'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutContent?.content || 'We are passionate about bringing creativity to life through hands-on crafting experiences'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img
                src={aboutImages[0]}
                alt="Craft Factory Workshop"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg';
                }}
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h3>
              <p className="text-gray-600 mb-6">
                Founded with a passion for creativity, Craft Factory has been inspiring artists and crafters 
                of all ages to explore their artistic potential. Our expert instructors and premium materials 
                create the perfect environment for learning and creating.
              </p>
              <p className="text-gray-600 mb-6">
                From daily slime-making classes to advanced crafting workshops, we offer a wide range of 
                activities designed to spark imagination and develop artistic skills.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Expert Instructors</h4>
              <p className="text-gray-600">Passionate professionals with years of experience</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Quality Materials</h4>
              <p className="text-gray-600">Premium supplies from trusted brands</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Small Classes</h4>
              <p className="text-gray-600">Intimate groups for personalized attention</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">All Skill Levels</h4>
              <p className="text-gray-600">From beginners to advanced crafters</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;