import React, { useState, useEffect } from "react";

const OurStoryPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const timelineEvents = [
    {
      year: "May 2023",
      title: "Artgram's Inception",
      description: "ArtGram starts in Vijayawada",
      icon: "🌱",
      color: "from-green-400 to-emerald-500",
    },
    {
      year: "Oct 2023",
      title: "Hyderabad Branch",
      description:
        "First branch in Hyderabad, Gachibowli",
      icon: "🏢",
      color: "from-blue-400 to-cyan-500",
    },
    {
      year: "Mar 2024",
      title: "Hyderabad Relocation",
      description:
        "Shift of location in Hyderabad: Gachibowli to Banjara Hills",
      icon: "📍",
      color: "from-purple-400 to-violet-500",
    },
    {
      year: "May 2024",
      title: "Summer Expansion",
      description:
        "Temporary summer branches in Mysore, Nellore, and Vizag",
      icon: "☀️",
      color: "from-orange-400 to-red-500",
    },
    {
      year: "2024",
      title: "Bengaluru Calling",
      description:
        "Branch in Bengaluru, HSR Layout",
      icon: "🚀",
      color: "from-indigo-400 to-purple-500",
    },
    {
      year: "Oct 2024",
      title: "New Activities",
      description: "Slime and tufting introduced",
      icon: "🎨",
      color: "from-pink-400 to-rose-500",
    },
    {
      year: "2025",
      title: "Future Vision",
      description:
        "Franchise branches in multiple cities of India.",
      icon: "✨",
      color: "from-yellow-400 to-amber-500",
    },
  ];

  const collaborationLogos = [
    {
      name: "Lala Land",
      url: "https://res.cloudinary.com/dwb3vztcv/image/upload/v1755589424/1_d02g4n.png",
    },
    {
      name: "Cocobakes",
      url: "https://res.cloudinary.com/dwb3vztcv/image/upload/v1755589425/2_tnqlc0.png",
    },
    {
      name: "The Culture Garage",
      url: "https://res.cloudinary.com/dwb3vztcv/image/upload/v1755589427/3_aic0ye.png",
    },
    {
      name: "Pop up",
      url: "https://res.cloudinary.com/dwb3vztcv/image/upload/v1755589429/4_gkcesc.png",
    },
    {
      name: "Lim",
      url: "https://res.cloudinary.com/dwb3vztcv/image/upload/v1755589433/6_t40s4k.png",
    },
    {
      name: "Kali",
      url: "https://res.cloudinary.com/dwb3vztcv/image/upload/v1755589431/5_wwhme1.png",
    },
  ];

  const featuredLogos = [
    {
      name: "The Hindu",
      url: "https://res.cloudinary.com/df2mieky2/image/upload/v1754843595/Screenshot_2025-08-10_220245_kh5xpy.png",
    },
    {
      name: "The New Indian Express",
      url: "https://res.cloudinary.com/df2mieky2/image/upload/v1754843718/Screenshot_2025-08-10_220452_v58xwq.png",
    },
    {
      name: "Eenadu",
      url: "https://res.cloudinary.com/df2mieky2/image/upload/v1754843509/Screenshot_2025-08-10_220123_dstox5.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
      {/* Hero Story Section */}
           <section className="relative min-h-screen flex items-center bg-gradient-to-br from-orange-200 via-amber-200 to-orange-300 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating elements */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute text-2xl opacity-30 animate-float"
              style={{
                left: `${5 + (i * 8)}%`,
                top: `${10 + (i % 5) * 20}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${6 + (i % 3)}s`
              }}
            >
              {i % 3 === 0 ? '🍊' : i % 3 === 1 ? '✨' : '⭐'}
            </div>
          ))}
          
          {/* Soft bubbles */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={`bubble-${i}`}
              className="absolute rounded-full bg-gradient-to-br from-amber-200/40 to-orange-300/40 backdrop-blur-sm animate-float"
              style={{
                width: `${40 + (i * 12)}px`,
                height: `${40 + (i * 12)}px`,
                left: `${80 - (i * 8)}%`,
                top: `${15 + (i % 4) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + (i % 4)}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}>
              <div className="relative group pt-8">
                {/* Cute frame effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-200 to-orange-300 rounded-3xl opacity-70 blur-md group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute -inset-2 bg-white/50 rounded-3xl backdrop-blur-sm" />
                
                <img
                  src="https://res.cloudinary.com/df2mieky2/image/upload/q_auto,f_auto,w_800/v1754830108/Screenshot_2025-08-10_181702_urntu7.png"
                  alt="A vibrant Artgram studio space with people creating art"
                  className="relative max-w-[400px] w-full mx-auto rounded-2xl shadow-lg transform group-hover:scale-105 transition-all duration-500 border-4 border-white"
                />
                
                {/* Decorative elements around image */}
                <div className="absolute -top-4 -right-4 text-4xl bg-white p-2 rounded-full shadow-md rotate-12">🎨</div>
                <div className="absolute -bottom-4 -left-4 text-4xl bg-white p-2 rounded-full shadow-md -rotate-12">🖌️</div>
              </div>
            </div>

            {/* Content - Keeping the exact same content but with orange color scheme */}
            <div className={`space-y-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">👋</div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                    Our Sweet Story
                  </h1>
                </div>
                
                <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-6" />
                
                <h2 className="text-3xl font-semibold text-orange-900 leading-relaxed">
                  From a Spark of Passion <span className="text-amber-600">to a Creative Community</span>
                </h2>
              </div>
              
              <div className="space-y-6 text-lg text-orange-800/90 leading-relaxed">
                <p>
                  Artgram is the ultimate destination for birthdays, get-togethers, and corporate events. Whether you're planning a cozy gathering or a grand celebration, we offer tailored packages to suit every occasion. 
                </p>
                
                <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-amber-200">
                  <div className="text-2xl mt-1">🎉</div>
                  <p>
                    Enjoy a private room with captivating activities, exquisite food with a buffet setup, and stunning décor. With capacity to accommodate 60 people, Artgram perfectly suits your venue destination needs.
                  </p>
                </div>
                
                <p>
                  From thoughtful return gifts to extra attractions like face painting, tattoos, or hair braiding, we have you covered. Whatever your vision, Artgram ensures a seamless, joyful experience for you and your guests!
                </p>
              </div>

              
            </div>
          </div>
        </div>
      </section>


      {/* Recognition & Partnerships Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Featured In */}
          <div className="text-center mb-9">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent mb-4 leading-tight md:leading-snug pb-2">
              Featured In
            </h2>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
  {featuredLogos.map((logo, index) => (
    <div
      key={logo.name}
      className="group transition-all duration-300 hover:scale-110 flex items-center justify-center"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <img
        src={logo.url}
        alt={logo.name}
        className="w-auto h-auto max-h-72 max-w-lg object-contain transition-all duration-300 drop-shadow-lg"
        style={{
          background: "transparent",
          borderRadius: "0",
          padding: "0",
        }}
      />
    </div>
  ))}
</div>


          {/* Collaborations */}
          <div className="mb-16 pt-16 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent mb-6 leading-tight md:leading-snug pb-2">
                Our Collaborations
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                Working together to spread creativity
              </p>
            </div>    

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {collaborationLogos.map((logo, index) => (
                <div
                  key={logo.name}
                  className="group text-center transition-all duration-300 hover:scale-110 flex flex-col items-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-44 h-44 mx-auto flex items-center justify-center mb-3 group-hover:shadow-2xl transition-all duration-300 p-0 bg-transparent">
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className="max-h-full max-w-full object-contain drop-shadow-lg"
                      style={{
                        borderRadius: "50%",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                      }}
                    />
                  </div>
                  <p className="font-semibold text-gray-700 group-hover:text-orange-600 transition-colors duration-300 text-lg">
                    {logo.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Franchise CTA */}
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-gray-600 via-gray-600 to-gray-600 rounded-3xl p-12 text-white text-center overflow-hidden shadow-2xl">
              {/* Background Elements */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-32 h-32 rounded-full bg-white animate-pulse"
                    style={{
                      left: `${20 + i * 20}%`,
                      top: `${20 + (i % 2) * 40}%`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div className="text-6xl mb-6">🤝</div>
                <h2 className="text-4xl font-bold mb-6">
                  Become a Part of Our Story
                </h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
                  Interested in bringing Artgram to your city? We are expanding
                  and looking for passionate partners to join our franchise
                  family.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
  <a href="tel:+91 9686846100" className="group bg-white text-orange-600 font-bold px-8 py-4 rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-xl">
    <span className="flex items-center justify-center gap-3">
      📞 Enquire About Franchise
      <div className="w-0 group-hover:w-4 h-0.5 bg-purple-600 rounded transition-all duration-300" />
    </span>
  </a>
  <button className="bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
    Learn More
  </button>
</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStoryPage;
