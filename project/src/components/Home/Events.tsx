import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Calendar, Clock, Users, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events: React.FC = () => {
  const { events, branches, cmsContent } = useData();
  const specialEvents = events.filter(e => e.isActive && e.price > 600).slice(0, 3);
  const eventsContent = cmsContent.find(c => c.type === 'events' && c.isActive);
  const eventImages = eventsContent?.images || [];

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Special Events</h2>
            <p className="text-xl text-gray-600">Join our exclusive workshops and special craft sessions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {specialEvents.map(event => {
              const branch = branches.find(b => b.id === event.branchId);
              const eventImage = eventImages[0] || 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg';
              return (
                <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={eventImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 bg-opacity-80 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Calendar className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-lg font-semibold">Special Workshop</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">Premium Event</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.time} ({event.duration} min)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.maxSeats - event.bookedSeats} seats available</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{branch?.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-600">₹{event.price}</span>
                      <Link
                        to="/events"
                        className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors inline-block"
                      >
                        Register Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              <span>View All Events</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;