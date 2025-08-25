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
    <>
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
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold mb-12 text-gray-800">Our Branches</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637272/wp6539521_vvafqv.jpg"
              name="Hyderabad"
              address="#NO.8-2-686/K/1 AND 8-2686/K/2, 5TH FLOOR, KIMTEE SQUARE, ROAD NO-12, BANJARA HILLS, CIRCLE 37, HYDERABAD 500034"
              phone="+917766012299"
              openTime="9:00 AM"
              closeTime="9:00 PM"
              onWhatsApp={() => openWhatsApp("917766012299", "Hi, I am interested in ArtGram activities in Hyderabad!")}
            />
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637352/jayanth-muppaneni-y96JVdGu7XU-unsplash_1_kooajm.jpg"
              name="Bangalore"
              address="#418, 4TH FLOOR, JB ARCADE, 27TH MAIN ROAD, HSR LAYOUT, SECTOR 1, BENGALURU 560102"
              phone="+919216345672"
              openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("919216345672", "Hi, I am interested in ArtGram activities in Bangalore!")}
            />
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637135/durgamma_temple_vj_6472215382_l3h6wj.jpg"
              name="Vijayawada"
              address="#40-6-11, 2ND FLOOR, MEENAKSHI TOWERS HOTEL, MURALI FORTUNE ROAD, MOGALRAJPURAM, OPP. SUBWAY 520010"
              phone="+919686846100"
              openTime="10:00 AM"
              closeTime="8:00 PM"
              onWhatsApp={() => openWhatsApp("919686846100", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
            <BranchCard
              img="https://media2.thrillophilia.com/images/photos/000/013/594/original/1567154682_shutterstock_1304062492.jpg?w=753&h=450&dpr=1.5"
              name="Yelagiri"
              address="Nilavoor Road
Yelagiri Hills - 635853, Tamil Nadu"
              phone="+919566351199"
              openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("919566351199", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
            <BranchCard
              img="https://im.whatshot.in/img/2020/Aug/istock-1139387103-cropped-1597665160.jpg"
              name="Nagpur"
              address="Kidzee Planet
Plot No. 18, Gajanan Mandir Road, Ring Road, Renghe Layout, Behind Bhagwaati Hall, Trimurtee Nagar, Nagpur, Maharashtra 440022
"
              phone="+91880630693"
              openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("918806320693", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
          </div>
        </div>
      </section>
    </>
  );
}

// BranchCard component moved to top level
const BranchCard = ({ img, name, address, phone, openTime, closeTime, onWhatsApp, instagram }) => {
  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer transform hover:scale-105">
      <div className="relative h-52 overflow-hidden">
        <img 
          src={img || "/placeholder.svg"} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-purple-600">{name}</h4>
        {/* Address with map icon and link */}
        <div className="flex items-start mb-3">
          <svg className="w-4 h-4 mt-1 mr-2 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
          </svg>
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-600 text-sm hover:text-purple-600 transition-colors"
          >
            {address}
          </a>
        </div>
        {/* Opening hours */}
        <div className="flex items-start mb-4">
          <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <div className="text-slate-600 text-sm">
            <div className="font-medium">Opening Hours:</div>
            <div>{openTime} - {closeTime}</div>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex gap-3 mt-auto">
          {/* Call */}
          <a 
            href={`tel:${phone}`} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
          </a>
          {/* WhatsApp */}
          <button 
            onClick={onWhatsApp} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.59 5.97L0 24l6.22-1.63A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22.02a9.92 9.92 0 01-5.05-1.38l-.36-.22-3.7.97.99-3.61-.24-.37A9.94 9.94 0 012.02 12C2.02 6.48 6.48 2.02 12 2.02c2.67 0 5.18 1.04 7.07 2.93A9.94 9.94 0 0121.98 12c0 5.52-4.46 10.02-9.98 10.02zm5.38-7.47c-.29-.15-1.72-.85-1.98-.95s-.46-.15-.65.15c-.2.29-.75.95-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.21-.45-2.3-1.44-.85-.76-1.42-1.7-1.59-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.2.05-.37-.02-.52-.07-.15-.63-1.52-.87-2.08-.23-.55-.47-.47-.65-.48-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.29-1.05 1.02-1.05 2.49 0 1.47 1.08 2.89 1.23 3.09.15.2 2.14 3.38 5.18 4.61.73.32 1.3.51 1.74.65.73.23 1.39.2 1.91.12.58-.09 1.72-.7 1.96-1.37.24-.67.24-1.24.17-1.36-.07-.12-.27-.19-.57-.34z"/>
            </svg>
          </button>
          {/* Google Maps */}
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a 
            href={instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.75 2.25a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

// Add openWhatsApp helper function
function openWhatsApp(phone, message) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export default Testimonials;