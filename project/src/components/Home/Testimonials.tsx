import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const { cmsContent } = useData();
  
  // Get testimonial images from CMS
  const testimonialsContent = cmsContent.find(c => c.type === 'testimonials' && c.isActive);
  const testimonialImages = testimonialsContent?.images || [
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg'
  ];
  
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Pune',
      rating: 5,
      comment: 'My daughter absolutely loves the slime making classes! The instructors are so patient and creative. Highly recommend!',
      image: testimonialImages[0] || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      location: 'Mumbai',
      rating: 5,
      comment: 'Great quality materials and excellent workshops. The kids had an amazing time and learned so much!',
      image: testimonialImages[1] || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'
    },
    {
      id: 3,
      name: 'Anita Desai',
      location: 'Pune',
      rating: 5,
      comment: 'The craft supplies are top-notch and the classes are well-organized. Perfect for family bonding time!',
      image: testimonialImages[2] || 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real experiences from our craft community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg';
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-orange-200" />
                  <p className="text-gray-600 italic pl-6">{testimonial.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;