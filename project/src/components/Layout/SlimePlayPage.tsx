"use client";

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from '../../contexts/DataContext';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { createRazorpayOrder, initiatePayment } from '../../utils/razorpay';

export default function SlimePlayPage() {
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  type BookingData = {
    location: string | null;
    date: string | null;
    session: string;
  price: number;
    time: string | null;
    quantity: number;
  };

  const [bookingData, setBookingData] = useState<BookingData>({
    location: null,
    date: null,
    session: "complete",
  price: 0,
    time: null,
    quantity: 1,
  });

  const [timeSlots, setTimeSlots] = useState([
    {
      time: "10:00",
      label: "10:00 AM",
      status: "available",
      type: "Slime Play & Demo",
      age: "3+ years",
      available: 12,
      total: 15,
    },
    {
      time: "11:30",
      label: "11:30 AM",
      status: "available",
      type: "Slime Play & Making",
      age: "8+ years",
      available: 8,
      total: 15,
    },
    {
      time: "1:00",
      label: "1:00 PM",
      status: "filling-fast",
      type: "Slime Play & Demo",
      age: "3+ years",
      available: 4,
      total: 15,
    },
    {
      time: "2:30",
      label: "2:30 PM",
      status: "available",
      type: "Slime Play & Demo",
      age: "3+ years",
      available: 15,
      total: 15,
    },
    {
      time: "4:00",
      label: "4:00 PM",
      status: "filling-fast",
      type: "Slime Play & Making",
      age: "8+ years",
      available: 3,
      total: 15,
    },
    {
      time: "5:30",
      label: "5:30 PM",
      status: "sold-out",
      type: "Slime Play & Demo",
      age: "3+ years",
      available: 0,
      total: 15,
    },
  ]);
  const { getSlotsForDate, createBooking, slotsVersion, getBranchById } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Map booking location codes to branch ids used in DataContext (stable ref)
  const branchMapRef = useRef<Record<string, string>>({ downtown: 'hyderabad', mall: 'vijayawada', park: 'bangalore' });

  // Load dynamic slots from DataContext when location or date changes
  useEffect(() => {
    if (!bookingData.location || !bookingData.date) return;
  const branchId = branchMapRef.current[bookingData.location];
    const saved = getSlotsForDate(branchId, bookingData.date);
    if (saved && saved.slime && Array.isArray(saved.slime)) {
      setTimeSlots(saved.slime.map(s => ({
        time: s.time,
        label: s.label || s.time,
        status: s.available <= 0 ? 'sold-out' : (s.available <= Math.max(1, Math.round(s.total * 0.25)) ? 'filling-fast' : 'available'),
        type: s.type,
        age: s.age,
        available: s.available,
        total: s.total,
  // ignore admin slot price; price comes from plan selection
  // price: s.price
      })));
    }
  }, [bookingData.location, bookingData.date, getSlotsForDate, slotsVersion]);

  // Handle initial user interaction to enable audio
  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (videoRef.current) {
        videoRef.current.muted = false;
        setMuted(false);
      }
    }
  };

  // Handle scroll to mute
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    const handleScroll = () => {
      if (videoRef.current && userInteracted) {
        videoRef.current.muted = true;
        setMuted(true);
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          // Don't auto-unmute after scrolling
        }, 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [userInteracted]);

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const el = document.getElementById(location.hash.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname]);

  // Booking flow functions
  const nextStep = (step: number) => setCurrentStep(step);
  const prevStep = (step: number) => setCurrentStep(step);
  const selectLocation = (location: string) => setBookingData(prev => ({ ...prev, location }));
  const selectDate = (date: string) => {
    if (!user) {
      // Redirect to login and preserve return path
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    setBookingData(prev => ({ ...prev, date }));
  };
  // Slime plans (customer chooses a plan and price is taken from here)
  const plans = [
    { id: 'base', label: 'Base Package', price: 750 },
    { id: 'premium', label: 'Premium Experience', price: 850 }
  ];
  const selectSession = (session: string, planId: string) => {
    // planId may be a plan id ('base'|'premium') or a numeric price string like '750' or '850'
    let price = 0;
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      price = plan.price;
    } else if (!isNaN(Number(planId))) {
      price = Number(planId);
    }
    setBookingData(prev => ({ ...prev, session, price }));
  };
  const selectTime = (time: string) => setBookingData(prev => ({ ...prev, time }));
  const setQuantity = (qty: number) => setBookingData(prev => ({ ...prev, quantity: Number(qty) }));

  const confirmBooking = async () => {
    if (!user) {
      // redirect to login and return here after login
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!bookingData.location || !bookingData.date || !bookingData.time) {
      alert('Please select location, date and time before proceeding.');
      return;
    }

    const total = getTotalPriceSafe();
    try {
  // create order (server-side is recommended). Use branch-specific publishable key when initiating payment.
  const branchId = bookingData.location ? branchMapRef.current[bookingData.location] : undefined;
  const branch = getBranchById(branchId);
  const order = await createRazorpayOrder(total);
  await initiatePayment({ amount: order.amount / 100, currency: order.currency, name: 'Craft Factory', description: 'Slime Booking', order_id: order.id, key: branch?.razorpayKey, handler: async (response) => {
        // on success create booking (store customer snapshot; manager will verify QR)
  const branchId = bookingData.location ? branchMapRef.current[bookingData.location] : undefined;
        await createBooking({
          eventId: `slot-${Date.now()}`,
          customerId: user.id,
          customerName: user.name,
          customerEmail: (user as User).email || '',
          customerPhone: '',
          branchId: branchId || 'hyderabad',
          date: bookingData.date || undefined,
          time: bookingData.time || undefined,
          seats: bookingData.quantity,
          totalAmount: total,
          paymentStatus: 'completed',
          paymentIntentId: response.razorpay_payment_id,
          qrCode: `QR-${Date.now()}`,
          isVerified: false
        });
        alert('Booking successful! Check your dashboard for details.');
        navigate('/dashboard');
  }, prefill: { name: user.name, email: (user as User).email || '' , contact: '' }, theme: { color: '#3399cc' }, modal: { ondismiss: () => {} } });
    } catch (e) {
      console.error('Payment/booking failed', e);
      alert('Payment failed. Please try again.');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not selected";
    return new Date(dateStr).toDateString();
  };

  type LocationKey = 'downtown' | 'mall' | 'park';
  const getLocationName = (location: LocationKey | string | null) => {
    const locationNames: Record<LocationKey, string> = {
      downtown: "Hyderabad",
      mall: "Vijayawada",
      park: "Bangalore",
    };
    if (!location) return 'Not selected';
    return (locationNames as Record<string, string>)[location] || "Not selected";
  };

  // If bookingData.price wasn't set for some reason, infer price from selected session
  const getPlanPrice = () => {
    if (bookingData.price && bookingData.price > 0) return bookingData.price;
    // Map internal session keys to plan ids used above
    const sessionToPlanId: Record<string, string> = {
      complete: 'premium',
      basic: 'base'
    };
    const planId = sessionToPlanId[bookingData.session] || 'base';
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.price : 0;
  };

  const getTotalPriceSafe = () => getPlanPrice() * bookingData.quantity;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-green-100 to-purple-100"
      onClick={handleUserInteraction}
    >
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-black flex items-center justify-center text-center text-white overflow-hidden">
  <div className="absolute inset-0 z-10">
    <video
      ref={videoRef}
      src="https://res.cloudinary.com/df2mieky2/video/upload/v1755029444/HYDERABAD_Slime_xa1l3x.mp4"
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

 
</section>



      {/* Package Overview Section */} 
      <section className="py-16 md:py-20">
  <div className="max-w-6xl mx-auto px-5 flex flex-col">
    
    {/* Title */}
    <h2 className="text-3xl md:text-4xl font-bold text-center text-red-600 mb-10">
      Choose Your Slime Adventure
    </h2>

    {/* Packages */}
   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
      
  {/* Base Package */}
  <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-green-400">
    <h3 className="text-2xl md:text-3xl font-black text-center text-red-600 mb-3">
      Rs 750/- Base Package
    </h3>
    <p className="text-gray-600 text-base md:text-lg font-medium text-center mb-4">
      Play + Demo or  Making
    </p>
    
    {/* Items */}
    <div className="space-y-4 mb-6">
      {/* Slime Play */}
      <div className="bg-white rounded-2xl p-4 md:p-5 flex items-start gap-4">
        <img
          src="https://res.cloudinary.com/df2mieky2/image/upload/v1754831671/HAR05994_de7kjp.jpg"
          alt="Slime Play"
          className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border"
        />
        <div>
          <h4 className="text-base md:text-lg font-bold text-red-600">
            Slime Play 
            <span className="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold ml-2">
              45 min
            </span>
          </h4>
          <p className="text-sm text-gray-600 leading-tight mt-1">
            Touch different colours and textures, slime throwing, jumping, magnetic slime and much more!
          </p>
        </div>
      </div>

      <h2 className="text-center">+</h2>

      {/* Slime Demo */}
      <div className="bg-white rounded-2xl p-4 md:p-5 flex items-start gap-4">
        <img
          src="https://res.cloudinary.com/df2mieky2/image/upload/v1754831672/DSC07792_xxy5w1.jpg"
          alt="Slime Demo"
          className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border"
        />
        <div>
          <h4 className="text-base md:text-lg font-bold text-red-600">
            Slime Demo 
            <span className="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold ml-2">
              15 min
            </span>
          </h4>
          <p className="text-sm text-gray-600 leading-tight mt-1">
            Hands-on experience for 8+ years. In some sessions, 8+ kits/adults can make their own slime. 
            Not available in all sessions — please check while booking.
          </p>
        </div>
      </div>
      <h2 className="text-center">or</h2>

      {/* Slime Making */}
      <div className="bg-white rounded-2xl p-4 md:p-5 flex items-start gap-4">
        <img
          src="https://res.cloudinary.com/df2mieky2/image/upload/v1754831672/DSC07792_xxy5w1.jpg"
          alt="Slime Making"
          className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border"
        />
        <div>
          <h4 className="text-base md:text-lg font-bold text-red-600">
            Slime Making 
            <span className="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold ml-2">
              15 min
            </span>
          </h4>
          <p className="text-sm text-gray-600 leading-tight mt-1">
            Hands-on experience for 8+ years. In some sessions, 8+ kits/adults can make their own slime. 
            Not available in all sessions — please check while booking.
          </p>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="text-center border-t-2 border-gray-100 pt-5">
      <div className="text-base md:text-lg font-semibold text-green-400 mb-4">
        ⏱️ Total: 1 Hour
      </div>
      <a
        href="#booking"
        onClick={() => selectSession("basic", 'base')}
        className="bg-green-400 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold hover:bg-blue-500 transition-colors"
      >
        Choose Base Package
      </a>
    </div>
  </div>

  {/* Premium Package */}
  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-purple-500">
    <h3 className="text-2xl md:text-3xl font-black text-center text-red-600 mb-2">
      Rs 850/- Premium Experience
    </h3>
    <p className="text-gray-600 text-base md:text-lg font-medium text-center mb-4">
      Ultimate Slime Adventure
    </p>

    <div className="mb-6">
     
      
      {/* Base Package Items */}
      <div className="space-y-4 mb-4">
        {/* Slime Play */}
        <div className="bg-white rounded-2xl p-4 md:p-5 flex items-start gap-4">
          <img
            src="https://res.cloudinary.com/df2mieky2/image/upload/v1754831671/HAR05994_de7kjp.jpg"
            alt="Slime Play"
            className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border"
          />
          <div>
            <h4 className="text-base md:text-lg font-bold text-red-600">
              Everything in Base Package
              <span className="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold ml-2">
                1 Hour
              </span>
            </h4>
            <p className="text-sm text-gray-600 leading-tight mt-1">
              Play + Demo or  Making
            </p>
          </div>
        </div>

        {/* Slime Demo OR Making */}
        
      </div>
      
      {/* Plus Icon */}
      <div className="flex justify-center my-3">
        <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">+</div>
      </div>
      
      {/* Premium Addition */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border-2 border-pink-400 flex items-start gap-4">
        <img
          src="https://res.cloudinary.com/df2mieky2/image/upload/v1754831818/Screenshot_2025-08-10_184600_dugdpm.png"
          alt="Glow in Dark"
          className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border"
        />
        <div>
          <h4 className="text-base md:text-lg font-bold text-red-600">
            ✨ Glow in Dark Experience 
            <span className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold ml-2">
              +15 min
            </span>
          </h4>
          <p className="text-sm text-gray-600 leading-tight mt-1">
            15 minutes of magical glowing slime in our special dark room. Watch your slime transform!
          </p>
        </div>
      </div>
    </div>

    <div className="text-center border-t-2 border-purple-100 pt-5">
      <div className="text-base md:text-lg font-semibold text-purple-600 mb-4">
        ⏱️ Total: 1 Hour 15 Minutes
      </div>
      <a
        href="#booking"
        onClick={() => selectSession("complete", "850")}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold hover:from-pink-500 hover:to-purple-500 transition-all"
      >
        Choose Premium Pack
      </a>
    </div>
  </div>
</div>

  </div>
</section>


      {/* Additional Information Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center text-red-600 mb-12">
            Additional Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border-l-4 border-green-400">
              <h4 className="text-xl font-bold text-red-600 mb-3">
                Booking Required
              </h4>
              <p className="text-gray-700">
                By booking only, Limited slots. Advance booking essential to
                secure your spot for this popular experience.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border-l-4 border-green-400">
              <h4 className="text-xl font-bold text-red-600 mb-3">
                Parent Supervision
              </h4>
              <p className="text-gray-700">
                One parent allowed with 1 kid (below 12yrs). We ensure a safe
                and supervised environment for all activities.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border-l-4 border-green-400">
              <h4 className="text-xl font-bold text-red-600 mb-3">
                Age Requirement
              </h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  For <strong>Slime Play & Demo</strong> sessions: anyone above{" "}
                  <strong>3+ years</strong> is welcome.
                </li>
                <li>
                  For <strong>Slime Play & Making</strong> sessions: anyone
                  above <strong>8+ years</strong> is welcome.
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 border-l-4 border-green-400">
              <h4 className="text-xl font-bold text-red-600 mb-3">
                Group & Private Sessions
              </h4>
              <p className="text-gray-700">
                All our Slime sessions are group sessions. Private sessions are
                available for an additional cost. Please contact us for details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center text-red-600 mb-12">
            Slime Experience Gallery
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "https://res.cloudinary.com/df2mieky2/image/upload/v1754831671/HAR05994_de7kjp.jpg",
              "https://res.cloudinary.com/df2mieky2/image/upload/v1754831665/HAR05956_cwxrxr.jpg",
              "https://res.cloudinary.com/df2mieky2/image/upload/v1754831664/IMG_5291.JPEG_fjpdme.jpg",
              "https://res.cloudinary.com/df2mieky2/image/upload/v1754831662/IMG_4561_axaohh.jpg",
              "https://res.cloudinary.com/df2mieky2/image/upload/v1754831660/IMG_3352_nsdiar.jpg",
              "https://res.cloudinary.com/df2mieky2/image/upload/v1754831672/DSC07792_xxy5w1.jpg",
            ].map((src, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-10 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-purple-500 to-pink-500"></div>
                <img
                  src={src || "/placeholder.svg"}
                  alt={`Slime activity ${index + 1}`}
                  className="w-full h-48 object-cover rounded-2xl hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-4xl font-bold text-center text-red-600 mb-8">Book Your Slime Experience</h2>
            
            {/* Step 1: Select Location */}
            {currentStep === 1 && (
              <div>
                <h3 className="text-2xl font-bold text-red-600 text-center mb-6">Step 1: Choose Location</h3>
                <div className="flex gap-5 flex-wrap justify-center mb-5">
                  {['downtown', 'mall', 'park'].map(id => (
                    <div key={id} onClick={() => selectLocation(id)} className={`border-2 rounded-xl p-6 text-center cursor-pointer transition-all min-w-48 ${bookingData.location === id ? 'border-green-400 bg-green-100 -translate-y-1 shadow-lg' : 'border-gray-200 hover:border-green-400 hover:bg-green-50'}`}>
                      <div className="font-bold text-lg mb-1">{getLocationName(id)}</div>
                      {id === 'mall' && <div className="text-xs text-red-500">No Session on Mondays</div>}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <button disabled={!bookingData.location} onClick={() => nextStep(2)} className="bg-green-400 text-black px-8 py-2 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition-colors disabled:bg-gray-300">Next</button>
                </div>
              </div>
            )}

            {/* Step 2: Select Date */}
            {currentStep === 2 && (
              <div>
                <h3 className="text-2xl font-bold text-red-600 text-center mb-6">Step 2: Select Your Date</h3>
                <div className="flex gap-4 flex-wrap justify-center mb-5">
                  {[...Array(9)].map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const value = date.toISOString().split('T')[0];
                    const isMonday = date.getDay() === 1;
                    const isHyderabad = bookingData.location === 'mall';
                    const isDisabled = isMonday && isHyderabad;
                    
                    return (
                      <div 
                        key={value} 
                        onClick={() => !isDisabled && selectDate(value)} 
                        className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all min-w-24 ${
                          isDisabled ? 'bg-gray-100 cursor-not-allowed opacity-50' :
                          bookingData.date === value ? 'border-green-400 bg-green-100 -translate-y-1 shadow-lg' : 
                          'border-gray-200 hover:border-green-400 hover:bg-green-50'
                        }`}
                      >
                        <div className="text-sm font-semibold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-xl font-bold my-1">{date.getDate()}</div>
                        <div className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                        {isDisabled && <div className="text-xs text-red-500 mt-1">No Sessions</div>}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={() => prevStep(1)} className="border-2 border-gray-500 text-gray-500 px-8 py-2 rounded-full font-semibold">Back</button>
                  <button disabled={!bookingData.date} onClick={() => nextStep(3)} className="bg-green-400 text-black px-8 py-2 rounded-full font-semibold hover:bg-blue-500 hover:text-white disabled:bg-gray-300">Next</button>
                </div>
              </div>
            )}
            
            {/* Step 3: Select Quantity */}
            {currentStep === 3 && (
                <div>
                    <h3 className="text-2xl font-bold text-red-600 text-center mb-6">Step 3: How many tickets?</h3>
                    <div className="flex justify-center items-center gap-4 mb-5">
                        <button onClick={() => setQuantity(Math.max(1, bookingData.quantity - 1))} className="w-12 h-12 rounded-full bg-gray-200 text-2xl font-bold">-</button>
                        <span className="text-4xl font-bold w-20 text-center">{bookingData.quantity}</span>
                        <button onClick={() => setQuantity(bookingData.quantity + 1)} className="w-12 h-12 rounded-full bg-gray-200 text-2xl font-bold">+</button>
                    </div>
                     <div className="flex justify-between mt-6">
                        <button onClick={() => prevStep(2)} className="border-2 border-gray-500 text-gray-500 px-8 py-2 rounded-full font-semibold">Back</button>
                        <button onClick={() => nextStep(4)} className="bg-green-400 text-black px-8 py-2 rounded-full font-semibold hover:bg-blue-500 hover:text-white">Next</button>
                    </div>
                </div>
            )}

            {/* Step 4: Select Session & Time */}
            {currentStep === 4 && (
              <div>
                <h3 className="text-2xl font-bold text-red-600 text-center mb-6">Step 4: Choose Session</h3>
                 <div className="flex gap-5 flex-wrap justify-center mb-10">
                    <div onClick={() => selectSession('complete', '850')} className={`border-2 rounded-2xl p-6 text-center cursor-pointer min-w-48 ${bookingData.session === 'complete' ? 'border-purple-400 bg-purple-100' : 'hover:border-purple-400'}`}>
                        <div className="font-bold text-lg mb-1">Premium Experience</div>
                        <div className="text-sm opacity-80 mb-2">Play + Demo + Glow (1 Hr 15 min)</div>
                        <div className="text-2xl font-bold text-red-500">Rs 850/-</div>
                    </div>
                    <div onClick={() => selectSession('basic', '750')} className={`border-2 rounded-2xl p-6 text-center cursor-pointer min-w-48 ${bookingData.session === 'basic' ? 'border-green-400 bg-green-100' : 'hover:border-green-400'}`}>
                        <div className="font-bold text-lg mb-1">Base Package</div>
                        <div className="text-sm opacity-80 mb-2">Play + Demo (1 Hour)</div>
                        <div className="text-2xl font-bold text-red-500">Rs 750/-</div>
                    </div>
                 </div>

                <h3 className="text-2xl font-bold text-red-600 text-center mb-6">Step 5: Select Time Slot</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                  {timeSlots.map((slot) => (
                    <div key={slot.time} onClick={() => slot.status !== 'sold-out' && selectTime(slot.time)} 
                    className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${ slot.status === 'sold-out' ? 'bg-gray-100 cursor-not-allowed opacity-60' : bookingData.time === slot.time ? 'border-green-400 bg-green-100 -translate-y-1 shadow-lg' : 'hover:border-green-400'}`}>
                      <div className="font-bold mb-1 text-lg">{slot.label}</div>
                      <div className="text-xs font-semibold text-blue-600">{slot.type}</div>
                       <div className="text-xs font-semibold text-purple-600 mb-2">({slot.age})</div>
                      <div className={`text-xs font-bold ${slot.status === 'sold-out' ? 'text-red-500' : slot.status === 'filling-fast' ? 'text-orange-500' : 'text-green-600'}`}>
                        {slot.status === 'sold-out' ? 'Sold Out' : `${slot.available}/${slot.total} available`}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={() => prevStep(3)} className="border-2 border-gray-500 text-gray-500 px-8 py-2 rounded-full font-semibold">Back</button>
                  <button disabled={!bookingData.time} onClick={() => nextStep(5)} className="bg-green-400 text-black px-8 py-2 rounded-full font-semibold hover:bg-blue-500 hover:text-white disabled:bg-gray-300">Next</button>
                </div>
              </div>
            )}

            {/* Step 6: Contact Details & Summary */}
            {currentStep === 5 && (
              <div>
                <h3 className="text-2xl font-bold text-red-600 text-center mb-6">Step 6: Contact & Summary</h3>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Contact Information</h4>
                    <div className="space-y-4">
                       <div>
                        <label className="block font-semibold text-gray-700 mb-1">Parent/Guardian Name *</label>
                        <input type="text" className="w-full border-2 border-gray-200 rounded-lg p-3" placeholder="Enter your name" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Phone Number *</label>
                        <input type="tel" className="w-full border-2 border-gray-200 rounded-lg p-3" placeholder="+91 XXXXX XXXXX" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                        <input type="email" className="w-full border-2 border-gray-200 rounded-lg p-3" placeholder="your.email@example.com" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold mb-4">Booking Summary</h4>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="space-y-2 text-sm">
                        <div><strong>Location:</strong> <span>{getLocationName(bookingData.location)}</span></div>
                        <div><strong>Date:</strong> <span>{formatDate(bookingData.date)}</span></div>
                        <div><strong>Time:</strong> <span>{bookingData.time || 'Not selected'}</span></div>
                        <div><strong>Tickets:</strong> <span>{bookingData.quantity}</span></div>
                        <div><strong>Session:</strong> <span>{bookingData.session === 'complete' ? 'Premium Experience' : 'Base Package'}</span></div>
                        <ul className="list-disc list-inside ml-4 pt-1">
                          <li>Slime Play (45 min)</li>
                          <li>Slime Demo/Making (15 min)</li>
                          {bookingData.session === 'complete' && <li>Glow in Dark Experience (15 min)</li>}
                        </ul>
                      </div>
                      <div className="text-3xl font-bold text-green-500 mt-4 pt-4 border-t border-gray-200">
                        Total: Rs {getTotalPriceSafe()}/-
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8">
                  <button onClick={() => prevStep(4)} className="border-2 border-gray-500 text-gray-500 px-8 py-2 rounded-full font-semibold">Back</button>
                  <button onClick={confirmBooking} className="w-full max-w-xs bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-xl font-bold text-lg">
                      Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}