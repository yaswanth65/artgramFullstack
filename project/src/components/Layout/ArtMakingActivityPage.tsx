"use client";

import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ArtMakingActivityPage() {
  // Map art forms to cloud image URLs (replace with your actual URLs)
  const artFormImages: Record<string, string> = {
    "Mosaic art": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756821152/Mosaic_art_oh4evo.jpg",
    "Piggy banks": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756821430/PIGGY_BANKS_w9qebo.jpg",
    "Welcome boards": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756820965/Welcome_boards_qawqq6.jpg",
    "Glass painting": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756822002/GLASS_PAINTING_lakjo7.jpg",
    "Rangoli stencils": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756822880/RANGOLI_STENCILS_d2vawy.jpg",
    "Letter arts": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756821577/LETTER_ARTS_g7x9to.jpg",
    "Spin art": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756821436/SPIN_ART_gazxfz.jpg",
    "Key holders": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756820335/key_gi1xur.jpg",
    "Name boards": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756821637/NAME_BOARDS_e7wpmm.jpg",
    "Acrylic pour": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756985501/Acrylic_pour_w4zy8f.jpg",
    "Block printing": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756821959/BLOCK_PAINTING_w7azus.jpg",
    "Clutch painting": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756821988/CLUTCH_PAINTING_ompdoo.jpg",
    "Mandalas": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756822165/MANDALAS_qs7bte.jpg",
    "Couple boards": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756822113/COUPLE_BOARDS_fmehkr.jpg",
    "Pichwai arts": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756821918/PICHWAI_ddmqia.jpg",
    "Madhubani": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756821954/MADHUBANI_ly7yvd.jpg",
    "Tissue art": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756822143/TISSUE_ART_uw1kad.jpg",
    "Home decor crafts": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756822687/HOME_DECOR_byfohg.jpg",
    "Gods painting": "https://res.cloudinary.com/dwb3vztcv/image/upload/v1756821934/GODS_PAINTING_nfbrdc.jpg",
  };
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const location = useLocation();
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);

  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (videoRef.current) {
        videoRef.current.muted = false;
        setMuted(false);
      }
    }
  };

  useEffect(() => {
    let scrollTimer;
    const handleScroll = () => {
      if (videoRef.current && userInteracted) {
        videoRef.current.muted = true;
        setMuted(true);
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {}, 1000);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); clearTimeout(scrollTimer); };
  }, [userInteracted]);

  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const el = document.getElementById(location.hash.replace('#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const artFormsKids = [
    "Mosaic art",
    "Piggy banks",
    "Welcome boards",
    "Glass painting",
    "Rangoli stencils",
    "Letter arts",
    "Spin art",
    "Key holders",
    "Name boards",
    "Acrylic pour"
  ];

  const artFormsAdults = [
    "Block printing",
    "Clutch painting",
    "Glass painting",
    "Mandalas",
    "Couple boards",
    "Pichwai arts",
    "Madhubani",
    "Tissue art",
    "Home decor crafts",
    "Gods painting"
  ];

  const features = [
    {
      icon: "🎨",
      title: "30+ Art Varieties",
      description:
        "Discover endless creative possibilities with our diverse collection of art forms.",
      color: "from-rose-400 to-pink-400",
    },
    {
      icon: "👥",
      title: "Collaborative Creation",
      description:
        "Share the magical journey of creation with loved ones on a single masterpiece.",
      color: "from-violet-400 to-purple-400",
    },
    {
      icon: "🏠",
      title: "Cherish Forever",
      description:
        "Take home your unique creation as a beautiful memory of your artistic journey.",
      color: "from-blue-400 to-indigo-400",
    },
    {
      icon: "⏰",
      title: "Timeless Experience",
      description:
        "Create at your own pace without any time constraints or pressure.",
      color: "from-emerald-400 to-teal-400",
    },
  ];

  return (
     <div 
      className="min-h-screen bg-white"
      onClick={handleUserInteraction}
    >
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-black flex items-center justify-center text-center text-white overflow-hidden">
  <div className="absolute inset-0 z-10">
    <video
      ref={videoRef}
      src="https://res.cloudinary.com/dwb3vztcv/video/upload/v1755544541/My_First_Project_sx8bvy.mp4"
      autoPlay
      loop
      playsInline
      muted={!userInteracted || muted}
      className="absolute w-auto min-w-full min-h-full max-w-none opacity-70"
    />

    {/* 🔊 Mute/Unmute button */}
    <button 
      onClick={() => {
        if (videoRef.current) {
          videoRef.current.muted = !videoRef.current.muted;
          setMuted(videoRef.current.muted);
        }
      }}
      className="absolute bottom-6 right-6 z-20 bg-black/50 hover:bg-black/70 rounded-full p-3 backdrop-blur-sm transition-all duration-300"
      aria-label={muted ? "Unmute video" : "Mute video"}
    >
      {muted ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.657 2.343m0 0a7.975 7.975 0 010 11.314m-11.314 0a7.975 7.975 0 010-11.314m0 0a7.975 7.975 0 015.657-2.343" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  </div>

  {/* 🔲 Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-0" />

  {/* Center content (if you want text here later) */}
  <div className="relative z-20 max-w-4xl text-center">
    {/* You can add a heading/intro text here if needed */}
  </div>

  {/* 🔘 Button pinned to bottom center */}
 
</section>

      {/* Main Content */}
      <section className="py-20 relative">


        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Experience Section 
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent mb-6 pb-5">
                Your Artistic Journey
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Immerse yourself in a world of creativity where every stroke
                tells a story
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`group relative bg-white rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100
                    ${activeCard === index ? "scale-105" : "hover:scale-102"}`}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}
                  />

                  <div className="relative z-10">
                    <div className="text-4xl md:text-5xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 group-hover:text-purple-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
*/}
          {/* Pricing Section with Artistic Design */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-white via-purple-50 to-rose-50 rounded-3xl p-8 md:p-12 shadow-2xl border border-purple-100">
              <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-center">
                {/* Pricing Info */}
                
                <div className="lg:col-span-2 space-y-4 md:space-y-2">
  <h3 className="text-5xl p-8 font-bold  bg-clip-text text-transparent mb-4 md:mb-6 " style={{ color: '#7F55B1' }}>
    Art Making Experience
  </h3>

  <div className="pt-1">
    <div className="pt-1 flex items-baseline gap-2 md:gap-4 mb-4 md:mb-6">
      <span className="text-4xl md:text-6xl font-bold text-gray-800">
        ₹350
      </span>
      <span className="text-xl md:text-2xl text-gray-500">to</span>
      <span className="text-4xl md:text-6xl font-bold text-gray-800">
        ₹2000
      </span>
    </div>
    <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
      Choose your art form and pay accordingly - no hidden costs!
    </p>
  </div>

  

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
    {[
      "Choose your preferred art form",
      "All premium materials included",
      "Expert guidance available",
      "No booking required",
      "Walk-in anytime",
      "Take your creation home",
      "30+ Art Varieties",
      "Collaborative Creation",
      "Cherish Forever",
      "Timeless Experience"
    ].map((item, i) => (
      <div key={i} className="flex items-center gap-3 group">
        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-rose-400 rounded-full group-hover:scale-150 transition-transform duration-300" />
        <span className="text-sm md:text-base text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
          {item}
        </span>
      </div>
    ))}
  </div>

                </div>

                {/* Special Offer */}
                <div className="relative">
                  <div className="rounded-3xl p-6 md:p-8 text-white text-center shadow-2xl transform hover:scale-105 transition-all duration-300" style={{backgroundColor: '#7F55B1'}}>
                    <div className="absolute -top-3 -right-3 w-12 h-12 md:-top-4 md:-right-4 md:w-16 md:h-16 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-lg">
                      HOT!
                    </div>
                    <h4 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Special Combo</h4>
                    <div className="text-3xl md:text-4xl font-bold mb-2">10% OFF</div>
                    <p className="text-purple-100 text-sm md:text-base mb-4 md:mb-6">
                      10% off only on art bill if you do slime ans arts on the same day.
                    </p>
                    <button className="bg-white text-purple-600 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors duration-300 text-sm md:text-base">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

{/*
           <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { value: "30+", label: "Art Varieties", icon: "🎨" },
                { value: "2+", label: "Years Min Age", icon: "👶" },
                { value: "₹350-₹2000", label: "Price Range", icon: "💰" },
                { value: "11AM-7PM", label: "Open Hours", icon: "🕐" },
              ].map((stat, i) => (
                <div key={i} className="group p-2 md:p-0">
                  <div className="text-3xl md:text-4xl mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">{stat.value}</div>
                  <div className="text-purple-100 font-medium text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
           */}

          {/* Art Forms Gallery - Kids Section */}
          <div className="mb-20 pt-20">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-3xl md:text-4xl font-black text-gray-800 mb-3 md:mb-4" style={{color: '#7F55B1'}}>
                Art Forms for Kids 🧑‍🎨
              </h3>
              <p className="text-lg md:text-xl text-gray-600">
                Fun and creative projects for our young artists
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {artFormsKids.map((art, index) => (
                <div
                  key={art}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200"
                >
                  <div className="text-center">
                    <img
                      src={artFormImages[art]}
                      alt={art}
                      className="w-32 h-32 object-cover rounded-xl mx-auto mb-4 border"
                      onError={e => { e.currentTarget.src = '/placeholder.svg'; }}
                    />
                    <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 text-base md:text-lg">
                      {art}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Art Forms Gallery - Adults Section */}
          <div className="mb-20">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-3xl md:text-4xl font-black mb-3 md:mb-4" style={{color: '#7F55B1'}}>
                Art Forms for Adults 🧑‍🎨
              </h3>
              <p className="text-lg md:text-xl text-gray-600">
                Explore a range of sophisticated and intricate art techniques
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {artFormsAdults.map((art, index) => (
                <div
                  key={art}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200"
                >
                  <div className="text-center">
                    <img
                      src={artFormImages[art]}
                      alt={art}
                      className="w-32 h-32 object-cover rounded-xl mx-auto mb-4 border"
                      onError={e => { e.currentTarget.src = '/placeholder.svg'; }}
                    />
                    <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 text-base md:text-lg">
                      {art}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Stats Section */}
         

          {/* Brochure Section */}
          <div className="mt-16 md:mt-20 text-center">
  <h3 className="text-3xl font-black mb-4" style={{ color: '#7F55B1' }}>Our Brochures</h3>
  <p className="text-base md:text-xl text-gray-600 mb-10">
    Get detailed information about all our art forms and pricing across different branches
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
    {/* Branch 1 */}
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 shadow-xl border border-gray-100">
      <h4 className="text-xl font-semibold text-gray-700 mb-4">Bangalore Branch</h4>
      <div style={{ position: 'relative', width: '100%', paddingTop: '141.4286%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(63,69,81,0.16)' }}>
        <iframe
          loading="lazy"
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none' }}
          src="https://www.canva.com/design/DAGkzJWHL44/aCM0VggQIbL4QbK96MEopw/view?embed"
          allowFullScreen
        ></iframe>
      </div>
      <a
        href="https://www.canva.com/design/DAGkzJWHL44/aCM0VggQIbL4QbK96MEopw/view"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block  text-white px-6 py-2 rounded-full shadow-md hover:scale-105 transition-transform"style={{backgroundColor: '#7F55B1'}}
      >
        📋 View / Download
      </a>
    </div>

    {/* Branch 2 */}
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 shadow-xl border border-gray-100">
      <h4 className="text-xl font-semibold text-gray-700 mb-4">Vijayawada Branch</h4>
      <div style={{ position: 'relative', width: '100%', paddingTop: '141.4286%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(63,69,81,0.16)' }}>
        <iframe
          loading="lazy"
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none' }}
          src="https://www.canva.com/design/DAFzM-Gz7Kg/92ExSAFWSxaxXJownvur4A/view?embed"
          allowFullScreen
        ></iframe>
      </div>
      <a
        href="https://www.canva.com/design/DAFzM-Gz7Kg/92ExSAFWSxaxXJownvur4A/view"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block  text-white px-6 py-2 rounded-full shadow-md hover:scale-105 transition-transform" style={{backgroundColor: '#7F55B1'}}
      >
        📋 View / Download
      </a>
    </div>

    {/* Branch 3 */}
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 shadow-xl border border-gray-100">
      <h4 className="text-xl font-semibold text-gray-700 mb-4">Hyderabad Branch</h4>
      <div style={{ position: 'relative', width: '100%', paddingTop: '141.4286%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(63,69,81,0.16)' }}>
        <iframe
          loading="lazy"
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none' }}
          src="https://www.canva.com/design/DAFzMTK_uQY/B3-KsNjAyUb0Jx3YCDwmtg/view?embed"
          allowFullScreen
        ></iframe>
      </div>
      <a
        href="https://www.canva.com/design/DAFzMTK_uQY/B3-KsNjAyUb0Jx3YCDwmtg/view"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block  text-white px-6 py-2 rounded-full shadow-md hover:scale-105 transition-transform" style={{backgroundColor: '#7F55B1'}}
      >
        📋 View / Download
      </a>
    </div>
  </div>
</div>

        </div>
      </section>
    </div>
  );
}
