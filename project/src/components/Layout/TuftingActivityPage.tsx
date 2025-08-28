"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { createRazorpayOrder, initiatePayment } from '../../utils/razorpay';



// Define gallery images to be used in the carousel and the gallery section
const galleryImages = [
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651196/DSC07703_y0ykmy.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651200/HAR05892_zs7cre.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651194/IMG_0168_kqn6hv.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651192/HAR05922_vmmr5p.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651195/DSC07659_zj2pcc.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651197/HAR05826_iefkzg.jpg",
];

const TuftingActivityPage = () => {
  // The booking process now starts with the location step.
  const [step, setStep] = useState("location");
  // State for storing available dates
  const [dates, setDates] = useState<Date[]>([]);
  // Types
  type TuftingSlot = { time: string; label?: string; available?: number; total?: number; status?: string; price?: number; type?: string; age?: string };
  type BookingSession = { id: string; price: number; label: string } | null;
  type BookingData = {
    date: string;
    location: string;
    session: BookingSession;
    time: string;
    quantity: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
  };

  // State for storing all booking details
  const [booking, setBooking] = useState<BookingData>({
    date: "",
    location: "",
    session: null,
    time: "",
    quantity: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
  });
  // State for the image carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);

  const { getSlotsForDate, createBooking, slotsVersion, getBranchById } = useData();
  const { branches } = useData();
  const { user } = useAuth();
  const [tuftingSlots, setTuftingSlots] = useState<TuftingSlot[]>([]);

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
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    const handleScroll = () => {
      if (videoRef.current && userInteracted) {
        if (videoRef.current) videoRef.current.muted = true;
        setMuted(true);
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {}, 1000);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); if (scrollTimer) clearTimeout(scrollTimer); };
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

  // Effect to generate the next 10 days for date selection
  useEffect(() => {
    const today = new Date();
    const arr = [];
    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    setDates(arr as Date[]);
  }, []);

  // Effect for the auto-playing image carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(timer);
  }, []);

  // Available tufting session options
  const sessions = [
    { id: "beginner", price: 2000, label: "Small - 8x8 (Inches)" },
    { id: "advanced", price: 3500, label: "Medium - 12x12 (Inches)" },
    { id: "master", price: 4500, label: "Big - 14x14 (Inches)" },
  ];

  // Memoized calculation for the total booking cost
  const total = useMemo(
    () =>
      booking.session && booking.quantity
        ? booking.session.price * Number(booking.quantity)
        : 0,
    [booking.session, booking.quantity]
  );

  // Handler for input changes to keep state updated
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setBooking((prev) => ({ ...prev, [id]: value } as BookingData));
  };

  // Load tufting slots when booking.location or booking.date changes
  useEffect(() => {
    if (!booking.location || !booking.date) return;
    const branchMap: Record<string, string> = { downtown: 'hyderabad', mall: 'vijayawada', park: 'bangalore', hyderabad: 'hyderabad', bangalore: 'bangalore', vijayawada: 'vijayawada' };
    const branchId = branchMap[booking.location] || booking.location;
    const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';

    (async () => {
      try {
        const res = await fetch(`${apiBase}/sessions/next-10-days/${branchId}?activity=tufting`);
        if (res.ok) {
          const sessions = await res.json();
          const forDate = sessions.filter((s: any) => s.date === booking.date && s.isActive).map((s: any) => ({
            time: s.time,
            label: s.label || s.time,
            available: s.availableSeats,
            total: s.totalSeats,
            status: s.availableSeats <= 0 ? 'sold-out' : s.availableSeats <= Math.max(1, Math.round(s.totalSeats * 0.25)) ? 'filling-fast' : 'available',
            type: s.type,
            age: s.ageGroup
          }));
          setTuftingSlots(forDate);
          return;
        }
      } catch (e) {
        // fall back below
      }
      const saved = getSlotsForDate(branchId, booking.date);
      if (saved && Array.isArray(saved.tufting)) {
        setTuftingSlots(saved.tufting as TuftingSlot[]);
      }
    })();
  }, [booking.location, booking.date, getSlotsForDate, slotsVersion]);

  // Check if all required fields for the final step are filled
  const canProceedToBook =
    booking.customerName && booking.customerPhone && booking.customerEmail && booking.quantity;

  return (
  <div onClick={handleUserInteraction}>
      {/* Hero Section with Video Background */}
       <section className="relative h-[70vh] bg-black flex items-center justify-center text-center text-white overflow-hidden">
  <div className="absolute inset-0 z-10">
    <video
      ref={videoRef}
      src="https://res.cloudinary.com/dwb3vztcv/video/upload/v1755546792/TUFTING_LANSCAPE_pm5v9h.mp4"
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
  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
    
  </div>
   
</section>

      

      {/* What is Tufting Section with Mini Carousel */}
     <section className="py-16 bg-gray-50">
  <div className="container mx-auto px-4">
    
    {/* Title */}
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-black mb-2" style={{ color: '#7F55B1' }}>
        🤔 What is Tufting?
      </h2>
      <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
        A modern twist on rug making — use a tufting gun to punch yarn into fabric
        and create your own textured art.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8 items-center">

      {/* Feature Cards */}
      <div className="flex flex-col space-y-5">
        <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <div className="text-3xl mb-2">🎨</div>
          <h3 className="text-lg font-bold mb-1 text-gray-800">
            Tufting Fun & Creativity
          </h3>
          <div className="flex items-center gap-3 group">
  {/* Bullet */}
  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full group-hover:scale-150 transition-transform duration-300" />
  
  {/* Text */}
  <p className="text-gray-600 text-sm md:text-base group-hover:text-gray-900 transition-colors duration-300">
    Make rugs, coasters, charms or wall art with colorful yarn and a tufting gun.
  </p>
</div>

        </div>

        <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <div className="text-3xl mb-2">🧵</div>
          <h3 className="text-lg font-bold mb-1 text-gray-800">
            Guided by Experts
          </h3>
          <div className="flex items-center gap-3 group">
  {/* Bullet */}
  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-rose-400 rounded-full group-hover:scale-150 transition-transform duration-300" />
  
  {/* Text */}
  <p className="text-gray-600 text-sm md:text-base group-hover:text-gray-900 transition-colors duration-300">
    Step-by-step help with plenty of colors to choose from.
  </p>
</div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <div className="text-3xl mb-2">🏠</div>
          <h3 className="text-lg font-bold mb-1 text-gray-800">
            Take Home Your Art 
          </h3>
           <div className="flex items-center gap-3 group">
  {/* Bullet */}
  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-rose-400 rounded-full group-hover:scale-150 transition-transform duration-300" />
  
  {/* Text */}
  <p className="text-gray-600 text-sm md:text-base group-hover:text-gray-900 transition-colors duration-300">
    Leave with a unique piece that reflects your style.
  </p>
</div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-xl shadow-lg overflow-hidden">
        <img
          key={currentImageIndex}
          src={galleryImages[currentImageIndex]}
          alt="Tufting creation"
          className="w-full h-full object-cover animate-fade-in"
        />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentImageIndex === index ? 'bg-white scale-110' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#7F55B1' }}>
            🖼️ Tufting Gallery - Customer Creations
          </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((src) => (
              <div key={src} className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src={src}
                  alt="Tufting creation by a student"
                  className="w-full h-[250px] object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = 'https://placehold.co/400x250/f9699c/white?text=Art' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
     <section
        id="tufting-booking"
        className="py-16"
        
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="backdrop-blur bg-white/95 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-center mb-8 text-purple-600">
              🎯 BOOK YOUR TUFTING EXPERIENCE NOW!
            </h2>

            {/* Step 1: Date Selection */}
            <TuftStep
              title="📅 Select Date"
              color="#9b59b6"
              isVisible={step === "date"}
              onNext={() => setStep("location")}
              canNext={Boolean(booking.date)}
            >
              <div className="flex flex-wrap gap-2">
                  {dates.map((d, i) => {
                  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
                  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                  const label = i === 0 ? "TODAY" : i === 1 ? "TOM" : dayNames[d.getDay()];
                  const iso = d.toISOString().split("T")[0];
                  const selected = booking.date === iso;
                    return (
                    <button
                      key={iso}
                      onClick={() => {
                        if (!user) {
                          navigate('/login', { state: { from: window.location.pathname } });
                          return;
                        }
                        setBooking((b) => ({ ...b, date: iso }));
                      }}
                      className={`min-w-[100px] text-center rounded-lg border-2 px-4 py-3 transition-all ${
                        selected
                          ? "border-purple-600 bg-purple-600 text-white -translate-y-0.5"
                          : "border-gray-300 bg-white hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="text-xs font-semibold">{label}</div>
                      <div className="text-xl font-extrabold">{d.getDate()}</div>
                      <div className="text-xs">{monthNames[d.getMonth()]}</div>
                    </button>
                  );
                })}
              </div>
            </TuftStep>

            {/* Step 2: Location Selection */}
            <TuftStep
              title="📍 Select Location"
              color="#9b59b6"
              isVisible={step === "location"}
              onBack={() => setStep("date")}
              onNext={() => setStep("session")}
              canNext={Boolean(booking.location)}
            >
              <div className="flex flex-wrap gap-3">
                {branches.filter(b => b.supportsTufting !== false).map((b) => ({ id: b.id, name: b.name.includes('Vijayawada') ? '🏬 Vijayawada' : b.name, detail: b.location })) .map((l) => {
                  const selected = booking.location === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setBooking((b) => ({ ...b, location: l.id }))}
                      className={`min-w-[200px] text-center rounded-xl border-2 px-6 py-5 transition-all ${
                        selected
                          ? "border-purple-600 bg-purple-600 text-white -translate-y-0.5 shadow"
                          : "border-gray-300 bg-white hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="font-bold">{l.name}</div>
                      <div className="text-sm opacity-80">{l.detail}</div>
                    </button>
                  );
                })}
              </div>
            </TuftStep>

            {/* Step 3: Session Selection */}
            <TuftStep
              title="🧶 Select Tufting Session (Per 2 Persons) ONLY 15+ YEARS"
              color="#9b59b6"
              isVisible={step === "session"}
              onBack={() => setStep("location")}
              onNext={() => setStep("time")}
              canNext={Boolean(booking.session)}
            >
              <div className="flex flex-wrap gap-3">
                {sessions.map((s) => {
                  const selected = booking.session?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setBooking((b) => ({ ...b, session: s }))}
                      className={`min-w-[200px] cursor-pointer rounded-xl border-2 px-6 py-6 text-center transition-all ${
                        selected
                          ? "border-purple-600 bg-purple-600 text-white -translate-y-1 shadow-xl"
                          : "border-gray-300 bg-white hover:-translate-y-1"
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {s.id === "beginner" ? "🌟" : s.id === "advanced" ? "🎨" : "👑"}
                      </div>
                      <div className="font-bold">{s.label}</div>
                      <div className="text-sm opacity-80">
                        02 - 04 Hr 
                      </div>
                      <div className={`mt-2 font-bold ${selected ? "text-white" : "text-red-600"}`}>
                        ₹ {s.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TuftStep>

            {/* Step 4: Time Slot Selection */}
            <TuftStep
              title="⏰ Select Time Slot"
              color="#9b59b6"
              isVisible={step === "time"}
              onBack={() => setStep("session")}
              onNext={() => setStep("details")}
              canNext={Boolean(booking.time)}
            >
              <div className="flex flex-wrap gap-2">
                {(tuftingSlots && tuftingSlots.length > 0 ? tuftingSlots.map((slot) => ({ t: slot.time, label: slot.label || slot.time, cls: slot.available === 0 ? 'sold-out' : 'available' })) : [
                  { t: "09:00", label: "9:00 AM", cls: "available" },
                  { t: "11:30", label: "11:30 AM", cls: "available" },
                  { t: "14:00", label: "2:00 PM", cls: "available" },
                  { t: "16:30", label: "4:30 PM", cls: "available" },
                  { t: "19:00", label: "7:00 PM", cls: "filling-fast" },
                ]).map((slot) => {
                  const selected = booking.time === slot.t;
                  return (
                    <div
                      key={slot.t}
                      onClick={() => setBooking((b) => ({ ...b, time: slot.t }))}
                      className={`min-w-[120px] text-center rounded-lg border-2 px-4 py-3 transition-all cursor-pointer ${
                        selected
                          ? "border-purple-600 bg-purple-600 text-white -translate-y-0.5"
                          : slot.cls === "filling-fast"
                          ? "border-orange-400"
                          : "border-gray-300 bg-white hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="font-bold">{slot.label}</div>
                      <div className="text-xs opacity-80">
                        {slot.cls === "filling-fast" ? "Filling Fast" : "Available"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TuftStep>

            {/* Step 5: Your Details */}
            <TuftStep
              title="👤 Your Details"
              color="#9b59b6"
              isVisible={step === "details"}
              onBack={() => setStep("time")}
              canNext={false}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    id="customerName"
                    type="text"
                    value={booking.customerName}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number *</label>
                  <input
                    id="customerPhone"
                    type="tel"
                    value={booking.customerPhone}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                    placeholder="+91 12345 67890"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email Address *</label>
                  <input
                    id="customerEmail"
                    type="email"
                    value={booking.customerEmail}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Number of Participants *</label>
                  <select
                    id="quantity"
                    value={booking.quantity}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                    required
                  >
                    <option value="" disabled>Select quantity</option>
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5 People</option>
                    <option value="6">6+ People (Group Booking)</option>
                  </select>
                </div>
              </div>

              {booking.quantity && booking.session && (
                <div
                  className="mt-6 rounded-2xl p-6 text-white"
                  style={{ background: "linear-gradient(135deg, #9b59b6, #e91e63)" }}
                >
                  <h5 className="font-bold mb-2">📋 Tufting Booking Summary</h5>
                  <div className="text-sm space-y-1">
                    <div><strong>Date:</strong> {booking.date ? new Date(booking.date).toLocaleDateString('en-GB') : ""}</div>
                    <div><strong>Location:</strong> <span className="capitalize">{booking.location}</span></div>
                    <div><strong>Session:</strong> {booking.session.label}</div>
                    <div><strong>Time:</strong> {booking.time}</div>
                    <div><strong>Participants:</strong> {booking.quantity}</div>
                  </div>
                  <div className="mt-3 text-center font-extrabold text-xl">
                    Total Amount: ₹{total.toLocaleString()}
                  </div>
                  <button
                    className={`mt-3 w-full rounded-full font-bold py-3 transition-all ${
                        canProceedToBook
                        ? 'bg-yellow-400 text-slate-800 hover:-translate-y-0.5'
                        : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    }`}
                    onClick={async () => {
                      if (!canProceedToBook) {
                        alert('Please fill in all required fields.');
                        return;
                      }
                      if (!user) {
                        navigate('/login', { state: { from: window.location.pathname } });
                        return;
                      }
                      const amount = booking.session ? booking.session.price * Number(booking.quantity) : 0;
                      try {
                        const branch = getBranchById(booking.location);
                        const order = await createRazorpayOrder(amount);
                        await initiatePayment({ amount: order.amount / 100, currency: order.currency, name: 'Artgram', description: 'Tufting Booking', order_id: order.id, key: branch?.razorpayKey, handler: async (response) => {
                          const bookingPayload: any = {
                              customerId: user.id,
                              customerName: user.name,
                              customerEmail: user.email || '',
                              customerPhone: booking.customerPhone || '',
                              branchId: booking.location,
                              date: booking.date,
                              time: booking.time,
                              seats: Number(booking.quantity),
                              totalAmount: amount,
                              paymentStatus: 'completed',
                              paymentIntentId: response.razorpay_payment_id,
                              activity: 'tufting',
                              packageType: booking.session?.id || 'standard'
                          };
                          
                          // Try to find session ID if available (for new API integration)
                          // This would require updating tufting slots fetching as well
                          
                          // Fallback to legacy eventId for now
                          if (!bookingPayload.sessionId) {
                            bookingPayload.eventId = `tuft-${Date.now()}`;
                          }
                          
                          await createBooking(bookingPayload);
                          alert('Tufting booked! Check your dashboard.');
                          navigate('/dashboard');
                        }, prefill: { name: user.name, email: user.email || '', contact: '' }, theme: { color: '#9b59b6' }, modal: { ondismiss: () => {} } });
                      } catch (err) {
                        console.error('Payment failed', err);
                        alert('Payment failed. Try again.');
                      }
                    }}
                    disabled={!canProceedToBook}
                  >
                    🧶 PROCEED TO BOOK TUFTING SESSION
                  </button>
                </div>
              )}
            </TuftStep>
          </div>
        </div>
      </section>
    </div>
  );
};

type TuftStepProps = {
  title: string;
  color: string;
  isVisible: boolean;
  onBack?: () => void;
  onNext?: () => void;
  canNext?: boolean;
  children: React.ReactNode;
};

const TuftStep: React.FC<TuftStepProps> = ({ title, color, isVisible, onBack, onNext, canNext, children }) => {
  if (!isVisible) return null;
  return (
    <div className="mb-6 bg-white rounded-2xl p-5 shadow">
      <div className="flex items-center justify-between gap-3 border-b pb-3 mb-4">
        <h4 className="text-lg font-bold" style={{ color }}>
          {title}
        </h4>
        <div className="flex gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-1.5 rounded-full bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors"
            >
              ← Back
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              disabled={!canNext}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all ${canNext
                ? "text-white hover:-translate-y-px"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              style={{ backgroundColor: canNext ? color : undefined }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default TuftingActivityPage;
