import React from 'react';
import { useData } from '../../contexts/DataContext';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Studios: React.FC = () => {
  const { branches, cmsContent } = useData();
  const studiosContent = cmsContent.find(c => c.type === 'studios' && c.isActive);
  const studioImages = studiosContent?.images || [];

  return (
    <section id="studios" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Studios</h2>
            <p className="text-xl text-gray-600">Visit our creative spaces across multiple locations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {branches.map(branch => (
              <div key={branch.id} className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-orange-400 to-pink-500 relative overflow-hidden">
                  {studioImages.length > 0 && (
                    <img
                      src={studioImages[0]}
                      alt={`${branch.name} Studio`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{branch.name}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{branch.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-orange-600 mr-3" />
                      <span className="text-gray-600">{branch.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-orange-600 mr-3" />
                      <span className="text-gray-600">{branch.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-orange-600 mr-3" />
                      <span className="text-gray-600">Mon-Sun: 9:00 AM - 8:00 PM</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors text-center"
                    >
                      Get Directions
                    </a>
                    <a 
                      href={`tel:${branch.phone}`}
                      className="flex-1 border border-orange-600 text-orange-600 py-2 rounded-md hover:bg-orange-50 transition-colors text-center"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>



  );
};

export default Studios;