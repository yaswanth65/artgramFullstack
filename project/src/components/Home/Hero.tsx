"use client";

import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

// Carousel images for hero section
const carouselImages = [
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651195/DSC07659_zj2pcc.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755025999/IMG-20250807-WA0003_u999yh.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755026061/HAR05826_hv05wz.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651197/HAR05826_iefkzg.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754831665/HAR05956_cwxrxr.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754831662/IMG_4561_axaohh.jpg",
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  function openWhatsApp(phoneNumber, message) {
    // Only proceed if window is available (client-side)
    if (typeof window !== 'undefined') {
      const encodedMessage = encodeURIComponent(message);
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const url = isMobile 
        ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
        : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  // Floating button visibility state and handlers
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (typeof window !== 'undefined') setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBookNow = () => {
    navigate('/slime-play.html');
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero Section with Carousel */}
      <header className="relative w-full max-w-6xl mx-auto mt-4 md:mt-8 px-4">
        <div className="relative w-full aspect-[4/3] md:aspect-video bg-gray-200 rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
          <img
            key={currentSlide}
            src={carouselImages[currentSlide]}
            alt="Artgram creation"
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          
          {/* Carousel Navigation - Hidden on mobile, visible on larger screens */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-2 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-2 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Mobile navigation - swipe area indicators */}
          <div className="md:hidden absolute inset-0 flex justify-between items-center z-10">
            <div 
              className="h-full w-1/4 flex items-center justify-start opacity-0 active:opacity-20 active:bg-gray-400 transition-opacity"
              onClick={prevSlide}
            ></div>
            <div 
              className="h-full w-1/4 flex items-center justify-end opacity-0 active:opacity-20 active:bg-gray-400 transition-opacity"
              onClick={nextSlide}
            ></div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white scale-110' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* The rest of your components remain the same */}
      {/* About Section */}
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
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
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
            <p className="text-4xl font-bold text-rose-600">25,000+</p>
            <p className="text-gray-600 font-medium">Customers</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <p className="text-4xl font-bold text-rose-600">40+</p>
            <p className="text-gray-600 font-medium">Unique Designs</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <p className="text-4xl font-bold text-rose-600">100+</p>
            <p className="text-gray-600 font-medium">Birthday Parties</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <p className="text-4xl font-bold text-rose-600">5</p>
            <p className="text-gray-600 font-medium">Studio Locations</p>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section
        id="activities"
        className="py-20 text-center bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Explore activities at Artgram
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <ActivityCard
              img="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755538130/HAR05881_knyc5j.jpg"
              title="🎨 Art Making"
              text="Enjoy 30+ hands on activities for all age groups"
              bgColor="bg-gradient-to-br from-pink-100 to-purple-100"
              link="/art-making-activity.html"
            />
            <ActivityCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754630801/HAR05956_c7944n.jpg"
              title="🌈 Slime Play"
              text="Get messy and creative with colorful, stretchy slime! Perfect for kids and adults who love sensory fun."
              bgColor="bg-gradient-to-br from-blue-100 to-cyan-100"
              link="/slime-play.html"
            />
            <ActivityCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651197/HAR05826_iefkzg.jpg"
              title="🧶 Tufting"
              text="Explore a new art form: make your own rugs and coasters to decorate your home."
              bgColor="bg-gradient-to-br from-green-100 to-emerald-100"
              link="/tufting-activity.html"
            />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center lg:justify-start">
              <a
                href="https://youtube.com/shorts/3Ho2S0v2PF0?si=jqswBjCvh31Vbd4u"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full max-w-lg h-72 rounded-2xl shadow-2xl border-4 border-gradient-to-r from-pink-200 to-purple-200 overflow-hidden relative"
              >
                <img
                  src="https://img.youtube.com/vi/3Ho2S0v2PF0/maxresdefault.jpg"
                  alt="YouTube Video Thumbnail"
                  className="w-full h-full object-cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-white drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </a>
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Events at Artgram
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-gray-700">
                Artgram is the ultimate destination for birthdays,
                get-togethers, and corporate events. Whether you're planning a
                cozy gathering or a grand celebration, we offer tailored
                packages to suit every occasion.
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Whatever your vision, Artgram ensures a seamless, joyful
                experience for you and your guests!
              </p>
            </div>
          </div>
          {/* Event Cards */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <EventCard
              icon="🎂"
              title="Birthdays"
              bgColor="bg-gradient-to-br from-purple-100 to-violet-100"
              link="/events.html#birthdays"
            />
            <EventCard
              icon="👶"
              title="Baby Shower"
              bgColor="bg-gradient-to-br from-blue-100 to-cyan-100"
              link="/events.html#baby-shower"
            />
            <EventCard
              icon="🏢"
              title="Corporate"
              bgColor="bg-gradient-to-br from-indigo-100 to-blue-100"
              link="/events.html#corporate"
            />
            <EventCard
              icon="🎨"
              title="Workshops"
              bgColor="bg-gradient-to-br from-green-100 to-teal-100"
              link="/events.html#workshops"
            />
          </div>
        </div>
      </section>

      {/* Instagram Feed Placeholder */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
      From Our Instagram
    </h2>
    <p className="text-gray-600 mb-10">
      Follow us{" "}
      <a
        href="https://www.instagram.com/artgram_yourhobbylobby/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-pink-600 hover:text-purple-600 hover:underline transition-colors"
      >
        @artgram_yourhobbylobby
      </a>
    </p>

    {/* Instagram-like cards */}
    <div className="grid md:grid-cols-3 gap-8">
      {/* Card 1 */}
      <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
        <img
          src="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755697368/480422168_673070211723714_4415539318595045525_n_dhm03i.jpg"
          alt="Reel 1"
          className="w-full h-96 object-cover transform group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <a
            href="https://www.instagram.com/reel/DGS5MUppMc4/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-pink-600 hover:text-white transition"
          >
            View on Instagram
          </a>
        </div>
      </div>

      {/* Card 2 */}
      <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
        <img
          src="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755697413/527539994_1083129567123356_9166913181327332852_n_cx6okk.jpg"
          alt="Reel 2"
          className="w-full h-96 object-cover transform group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <a
            href="https://www.instagram.com/reel/DNC-sJuR0A4/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-pink-600 hover:text-white transition"
          >
            View on Instagram
          </a>
        </div>
      </div>

      {/* Card 3 */}
      <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
        <img
          src="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755697208/528978528_1298911128567327_2580940791983865225_n_qxbuqg.jpg"
          alt="Reel 3"
          className="w-full h-96 object-cover transform group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <a
            href="https://www.instagram.com/reel/DM91tFgvQrS/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-orange-600 hover:text-white transition"
          >
            View on Instagram
          </a>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-16 text-center">
            In their own words: Artgram experiences
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto text-white">
            <TestimonialCard
              stars="⭐⭐⭐⭐⭐"
              text="Had a wonderful time doing the slime activity! Everything was well-organized, and the staff were so kind, patient, and engaging. It was a lot of fun for both kids and adults!"
              name="Tejaswi Kalisetty"
              bgColor="bg-gradient-to-br from-gray-600 to-blue-900 text-white"
            />
            <TestimonialCard
              stars="⭐⭐⭐⭐⭐"
              text="We hosted a onesie-themed baby shower at Artgram, and it was the best decision! Their team was attentive and turned a simple idea into a beautiful, memorable event."
              name="Mohana Swetha Nune"
              bgColor="bg-gradient-to-br from-gray-600 to-blue-900 text-white"
            />
            <TestimonialCard
              stars="⭐⭐⭐⭐⭐"
              text="I celebrated my daughter's birthday party here and everyone had a fantastic time! The venue was spacious, bright, and easy to reach, and the team was very responsive."
              name="Bhaswati Bhar"
              bgColor="bg-gradient-to-br from-gray-600 to-blue-900 text-white"
            />
          </div>
        </div>
      </section>

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

      {/* Floating action buttons: Book Now and Scroll to Top */}
      <div aria-hidden={false} className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
        <button
          onClick={handleBookNow}
          className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
          aria-label="Book Slime Session"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a2 2 0 00-2 2v1H7a2 2 0 00-2 2v1H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a2 2 0 00-2-2h-3V4a2 2 0 00-2-2zM9 7V5h6v2H9z"/>
          </svg>
          <span className="font-semibold">Book Slime Session</span>
        </button>

        {showTop && (
          <button
            onClick={scrollToTop}
            className="inline-flex items-center justify-center bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Activity Card Component with Link wrapper
const ActivityCard = ({ img, title, text, bgColor, link }) => {
  return (
    <Link to={link} className="block no-underline">
      <div
        className={`${bgColor} rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col border border-white/50 cursor-pointer`}
      >
        <div className="relative overflow-hidden">
          <img
            src={img}
            alt={title}
            className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-bold text-xl mb-3 text-gray-800">{title}</h3>
          <p className="text-gray-700 text-base leading-relaxed flex-grow">
            {text}
          </p>
        </div>
      </div>
    </Link>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ stars, text, name, bgColor }) => {
  return (
    <div
      className={`${bgColor} p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 border border-white/50`}
    >
      <div className="flex flex-col h-full text-white">
        <div className="text-2xl mb-4 text-amber-500">{stars}</div>
        <p className="leading-relaxed mb-6 flex-grow italic opacity-90">"{text}"</p>
        <div className="flex items-center mt-auto">
          <p className="font-bold text-lg opacity-95">{name}</p>
        </div>
      </div>
    </div>
  );
};

// Event Card Component with Link wrapper
const EventCard = ({ icon, title, bgColor, link }) => {
  return (
    <Link to={link} className="block no-underline">
      <div
        className={`text-center p-6 ${bgColor} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 cursor-pointer`}
      >
        <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
    </Link>
  );
};

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

export default HomePage;