import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Activities: React.FC = () => {
  const { events, branches } = useData();
  const upcomingEvents = events.filter(e => e.isActive).slice(0, 4);

  return (
    <section id="activities" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Daily Activities</h2>
            <p className="text-xl text-gray-600">Join our exciting daily classes and workshops</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {upcomingEvents.map(event => {
              const branch = branches.find(b => b.id === event.branchId);
              return (
                <div key={event.id} className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg shadow-lg overflow-hidden text-white">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                    <p className="mb-4 opacity-90">{event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        <span>{event.maxSeats - event.bookedSeats} seats left</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>{branch?.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">₹{event.price}</span>
                      <Link
                        to="/events"
                        className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block"
                      >
                        Book Now
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
              className="inline-flex items-center space-x-2 bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              <span>View All Activities</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;