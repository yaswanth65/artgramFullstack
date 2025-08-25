"use client";
import React, { useState, useEffect } from 'react';

const ContactUsPage = () => {
    const [isVisible, setIsVisible] = useState(false)
    useEffect(() => {
        setIsVisible(true)
      }, [])
  
  // Helper functions to open email and WhatsApp
  function openGmail(email) {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, "_blank");
  }

  function openWhatsApp(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const url = isMobile 
      ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.namedItem("name")?.value || "there";
    alert(`Thank you for contacting us, ${name}! We'll get back to you shortly.`);
    form.reset();
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-rose-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-rose-900 overflow-hidden">
      <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm animate-pulse"
              style={{
                left: `${15 + (i * 15)}%`,
                top: `${20 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className={`text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <div className="mb-6">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-rose-200 bg-clip-text text-transparent mb-4">Get in Touch</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-rose-400 mx-auto rounded-full mb-6" />
            </div>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">We'd love to hear from you! Whether it's a question, feedback, or collaboration idea—drop us a message.</p>
        </div>
        </div>
      </section>

      {/* Contact Form & Details */}
      

      {/* Branches Section */}
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

      {/* Map Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Studio Locations</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Visit us at any of our vibrant studios across South India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hyderabad Location */}
            <a 
              href="https://www.google.com/maps/place/Artgram/@17.4114992,78.4323407,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb970038d64857:0x406d7a28320f2e9b!8m2!3d17.4114992!4d78.4349156!16s%2Fg%2F11ryf2z9v5?entry=ttu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
            >
              <div className="h-64 relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.0060108339585!2d78.43234067524435!3d17.411499183479815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb970038d64857%3A0x406d7a28320f2e9b!2sArtgram!5e0!3m2!1sen!2sin!4v1755189886825!5m2!1sen!2sin"
                  title="Artgram Hyderabad Location"
                  className="w-full h-full absolute inset-0 pointer-events-none"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-xl">Hyderabad</h3>
                </div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    📍
                  </div>
                  <p className="text-gray-700 font-medium">Banjara Hills, Road No. 12</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    🕒
                  </div>
                  <p className="text-gray-700">Mon-Sun: 9AM - 9PM</p>
                </div>
                <div className="mt-4 text-purple-600 font-medium flex items-center gap-2">
                  <span>View on Maps</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Vijayawada Location */}
            <a 
              href="https://www.google.com/maps/place/ARTGRAM/@16.5041061,80.6443325,17z/data=!3m1!4b1!4m6!3m5!1s0x3a35fbf061f36a01:0x57d79131087c8de4!8m2!3d16.5041061!4d80.6469074!16s%2Fg%2F11v0v3c8w4?entry=ttu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
            >
              <div className="h-64 relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.4353260109456!2d80.64433247522446!3d16.504106084240263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35fbf061f36a01%3A0x57d79131087c8de4!2sARTGRAM!5e0!3m2!1sen!2sin!4v1755189043469!5m2!1sen!2sin"
                  title="Artgram Vijayawada Location"
                  className="w-full h-full absolute inset-0 pointer-events-none"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-xl">Vijayawada</h3>
                </div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    📍
                  </div>
                  <p className="text-gray-700 font-medium">MG Road, Near Prakasam Barrage</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    🕒
                  </div>
                  <p className="text-gray-700">Mon-Sun: 10AM - 8PM</p>
                </div>
                <div className="mt-4 text-purple-600 font-medium flex items-center gap-2">
                  <span>View on Maps</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Bengaluru Location */}
            <a 
              href="https://www.google.com/maps/place/Artgram/@12.9187316,77.6491285,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae15ae8353d0dd:0x395df1674441651f!8m2!3d12.9187316!4d77.6517034!16s%2Fg%2F11s7j9wq5_?entry=ttu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
            >
              <div className="h-64 relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8286590945104!2d77.64912847515608!3d12.918731587391807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15ae8353d0dd%3A0x395df1674441651f!2sArtgram!5e0!3m2!1sen!2sin!4v1755189902986!5m2!1sen!2sin"
                  title="Artgram Bengaluru Location"
                  className="w-full h-full absolute inset-0 pointer-events-none"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-xl">Bengaluru</h3>
                </div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    📍
                  </div>
                  <p className="text-gray-700 font-medium">HSR Layout, Sector 2</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    🕒
                  </div>
                  <p className="text-gray-700">Mon-Sun: 9:30AM - 9:30PM</p>
                </div>
                <div className="mt-4 text-purple-600 font-medium flex items-center gap-2">
                  <span>View on Maps</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-5 gap-12">
          {/* Form on the left */}
          

          {/* Contact info on the right */}
          <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-xl border-gray-100 sticky top-32">
            <h3 className="text-2xl font-semibold mb-6">Reach Us Directly</h3>
            <div className="space-y-4 text-slate-900">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <div>
                  <strong>Email:</strong><br />
                  <button onClick={() => openGmail("artgram.yourhobbylobby@gmail.com")} className="text-purple-600 hover:underline">
                    artgram.yourhobbylobby@gmail.com
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
                <div>
                  <strong>Phone:</strong><br />
                  <a href="tel:+919686846100" className="hover:text-purple-600">+91 9686846100</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                <div>
                  <strong>Instagram:</strong><br />
                  <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/artgram_yourhobbylobby/?hl=en" className="text-purple-600 hover:underline">
                    @artgram_yourhobbylobby
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <div>
                  <strong>Business Hours:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-700">
                    <li>Mon - Sat: 10:00 AM - 8:00 PM</li>
                    <li>Sun: 10:00 AM - 6:00 PM</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * Branch Card Component with official logos
 */
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


export default ContactUsPage;