import { useState } from "react";
import {
  Play,
  Star,
  Calendar,
  Users,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const events = [
    {
      id: 1,
      icon: "🎂",
      title: "Birthday Parties",
      shortDesc:
        "Make birthdays unforgettable with themed art parties, slime making, and creative activities for all ages.",
      description:
        "Transform your child's special day into an artistic adventure! Our birthday party packages include personalized themes, age-appropriate art activities, and memorable takeaways. From canvas painting to pottery wheels, we ensure every guest leaves with a masterpiece and beautiful memories.",
      features: [
        "Customized themes",
        "All materials included",
        "Professional guidance",
        "Party favors",
        "Clean-up service",
      ],
      images: [
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop",
      ],
      feedbacks: [
        {
          name: "Priya Sharma",
          rating: 5,
          comment:
            "Amazing party! The kids were engaged for hours. Highly recommend!",
        },
        {
          name: "Rajesh Kumar",
          rating: 5,
          comment:
            "Professional team, creative activities. Best birthday party ever!",
        },
        {
          name: "Meera Patel",
          rating: 4,
          comment:
            "Great experience, kids loved the art activities. Will book again!",
        },
      ],
      videos: [
        {
          title: "Birthday Party Highlights",
          thumbnail:
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=200&fit=crop",
        },
        {
          title: "Kids Art Session",
          thumbnail:
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=300&h=200&fit=crop",
        },
      ],
    },
    {
      id: 2,
      icon: "🏢",
      title: "Corporate Events",
      shortDesc:
        "Team building activities with art workshops, collaborative projects, and stress-relief creative sessions.",
      description:
        "Boost team morale and creativity with our corporate art workshops. Perfect for team building, stress relief, and fostering innovation. Our facilitators guide groups through collaborative projects that enhance communication and build stronger workplace relationships.",
      features: [
        "Team building focus",
        "Flexible scheduling",
        "Corporate packages",
        "Professional facilitation",
        "Certificates",
      ],
      images: [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop",
      ],
      feedbacks: [
        {
          name: "Tech Solutions Ltd",
          rating: 5,
          comment:
            "Excellent team building activity. Our team loved the creative challenge!",
        },
        {
          name: "Marketing Pro Inc",
          rating: 5,
          comment:
            "Perfect for stress relief. Everyone was so relaxed and happy afterwards.",
        },
        {
          name: "Design Studio",
          rating: 4,
          comment:
            "Great way to break the routine. Highly professional service.",
        },
      ],
      videos: [
        {
          title: "Corporate Team Building",
          thumbnail:
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=200&fit=crop",
        },
        {
          title: "Office Art Workshop",
          thumbnail:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=200&fit=crop",
        },
      ],
    },
    {
      id: 3,
      icon: "🎨",
      title: "Art Workshops",
      shortDesc:
        "Community workshops featuring guest artists, new techniques, and collaborative art projects.",
      description:
        "Join our regular community workshops to learn new techniques, meet fellow art enthusiasts, and create beautiful pieces. From watercolor basics to advanced sculpting, our expert instructors provide personalized guidance for all skill levels.",
      features: [
        "Expert instructors",
        "All skill levels",
        "Materials provided",
        "Small groups",
        "Monthly themes",
      ],
      images: [
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&h=300&fit=crop",
      ],
      feedbacks: [
        {
          name: "Anita Desai",
          rating: 5,
          comment:
            "Learning so much in each session. The instructors are amazing!",
        },
        {
          name: "Vikram Singh",
          rating: 5,
          comment: "Great community, love the monthly themes. Very inspiring!",
        },
        {
          name: "Pooja Malhotra",
          rating: 4,
          comment:
            "Perfect for beginners like me. Very encouraging environment.",
        },
      ],
      videos: [
        {
          title: "Watercolor Workshop",
          thumbnail:
            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop",
        },
        {
          title: "Pottery Class",
          thumbnail:
            "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&h=200&fit=crop",
        },
      ],
    },
    {
      id: 4,
      icon: "👫",
      title: "Kitty Parties",
      shortDesc:
        "Private group bookings for friends, families, or special occasions with customized activities.",
      description:
        "Make your kitty party memorable with creative activities that bring friends together. Our customized sessions include art activities, refreshments, and plenty of laughter. Perfect for ladies' groups, friend circles, and special get-togethers.",
      features: [
        "Private bookings",
        "Customized activities",
        "Refreshments included",
        "Group discounts",
        "Photo sessions",
      ],
      images: [
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop",
      ],
      feedbacks: [
        {
          name: "Sunita Group",
          rating: 5,
          comment: "Best kitty party ever! Everyone loved the art activities.",
        },
        {
          name: "Friends Forever Club",
          rating: 5,
          comment: "So much fun! The perfect way to bond with friends.",
        },
        {
          name: "Ladies Circle",
          rating: 4,
          comment: "Creative and enjoyable. Will definitely book again!",
        },
      ],
      videos: [
        {
          title: "Kitty Party Fun",
          thumbnail:
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop",
        },
        {
          title: "Group Art Session",
          thumbnail:
            "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&h=200&fit=crop",
        },
      ],
    },
    {
      id: 5,
      icon: "🎪",
      title: "Baby Shower Parties",
      shortDesc:
        "Celebrate new beginnings with gentle art activities and memorable keepsakes for expecting mothers.",
      description:
        "Celebrate the upcoming arrival with our special baby shower art parties. Create personalized keepsakes, decorate onesies, and make beautiful memories with art activities designed for expecting mothers and their loved ones.",
      features: [
        "Gentle activities",
        "Keepsake creation",
        "Maternity-friendly",
        "Custom decorations",
        "Memory book",
      ],
      images: [
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1576219313824-e2d0d7f72056?w=500&h=300&fit=crop",
      ],
      feedbacks: [
        {
          name: "Kavita Agarwal",
          rating: 5,
          comment:
            "Perfect for my baby shower. Everyone loved creating keepsakes!",
        },
        {
          name: "Rina Chopra",
          rating: 5,
          comment:
            "So thoughtful and creative. Made my special day even more memorable.",
        },
        {
          name: "Deepa Jain",
          rating: 4,
          comment:
            "Beautiful activities, perfect for expecting mothers. Highly recommend!",
        },
      ],
      videos: [
        {
          title: "Baby Shower Celebration",
          thumbnail:
            "https://res.cloudinary.com/dwb3vztcv/video/upload/v1755549136/BABY_SHOWER_AT_ARTGARM_jjzl9x.mp4",
        },
        {
          title: "Keepsake Creation",
          thumbnail:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
        },
      ],
    },
  ];

  const nextImage = () => {
    if (selectedEvent) {
      setCurrentImageIndex((prev) =>
        prev === selectedEvent.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedEvent) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedEvent.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-900 via-orange-900 to-orange-900 overflow-hidden">
        {/* Background Elements */}
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

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 text-center">
          <div className="mb-6 inline-block rounded-full bg-white/10 px-6 py-2 backdrop-blur-sm">
            <span className="text-sm font-medium text-white">
              ✨ Creating Magical Moments
            </span>
          </div>
          <h1 className="mb-6 text-5xl font-extrabold leading-tight text-white md:text-7xl">
            Special{" "}
            <span className="bg-gradient-to-r from-orange-400 to-orange-400 bg-clip-text text-transparent">
              Events
            </span>
          </h1>
          <p className="mb-4 text-xl text-white/90 md:text-2xl">
            Celebrate life's special moments with creative experiences
          </p>
          <p className="text-lg text-white/80">
            Birthday parties, corporate events, and community workshops
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              Our Events
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our variety of creative experiences
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => {
                  setSelectedEvent(event);
                  setActiveTab("description");
                  setCurrentImageIndex(0);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed left-0 right-0 bottom-0 top-24 z-50 bg-black/60 backdrop-blur-sm">
          <div className="relative h-[calc(100vh-6rem)] w-screen overflow-hidden bg-white">
            {/* Close Button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute right-6 top-6 z-10 rounded-full bg-white/10 p-2 text-gray-600 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="overflow-y-auto h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-12 text-white">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm">
                    {selectedEvent.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">
                      {selectedEvent.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b bg-gray-50 px-4 md:px-8 ">
                <nav className="flex space-x-4 md:space-x-8 overflow-x-auto hide-scrollbar">
                  {[
                    { id: "description", label: "Description", icon: "📝" },
                    { id: "images", label: "Gallery", icon: "🖼️" },
                    { id: "feedback", label: "Reviews", icon: "⭐" },
                    { id: "videos", label: "Videos", icon: "🎥" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 border-b-2 px-3 py-3 md:px-4 md:py-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-rose-500 text-rose-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content Sections */}
              <div className="p-8">
                {activeTab === "description" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="mb-3 text-xl font-semibold text-gray-800">
                        About This Event
                      </h4>
                      <p className="leading-relaxed text-gray-600">
                        {selectedEvent.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-3 text-xl font-semibold text-gray-800">
                        What's Included
                      </h4>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {selectedEvent.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 py-4 text-white font-semibold text-lg hover:shadow-lg transition-all transform hover:scale-105">
                      Book This Event
                    </button>
                  </div>
                )}

                {activeTab === "images" && (
                  <div className="space-y-6">
                    <div className="relative">
                      <img
                        src={selectedEvent.images[currentImageIndex]}
                        alt={`${selectedEvent.title} ${currentImageIndex + 1}`}
                        className="h-96 w-full rounded-2xl object-cover shadow-lg"
                      />

                      {selectedEvent.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm hover:bg-white"
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm hover:bg-white"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {selectedEvent.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 rounded-xl overflow-hidden ${
                            currentImageIndex === index
                              ? "ring-4 ring-orange-500"
                              : ""
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="h-20 w-32 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "feedback" && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="mb-2 flex items-center justify-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-6 w-6 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-2xl font-bold text-gray-800">
                          4.9
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Based on {selectedEvent.feedbacks.length} reviews
                      </p>
                    </div>

                    <div className="space-y-4">
                      {selectedEvent.feedbacks.map((feedback, index) => (
                        <div key={index} className="rounded-2xl bg-gray-50 p-6">
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-800">
                                {feedback.name}
                              </h5>
                              <div className="flex">
                                {[...Array(feedback.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">{feedback.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "videos" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {selectedEvent.videos.map((video, index) => (
                        <div
                          key={index}
                          className="group cursor-pointer overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-xl transition-all"
                        >
                          <div className="relative">
                            {(
                              video.src ||
                              (video.thumbnail &&
                                (video.thumbnail.endsWith(".mp4") ||
                                  video.thumbnail.endsWith(".webm") ||
                                  video.thumbnail.endsWith(".ogg")))
                            ) ? (
                              <video
                                controls
                                src={video.src ? video.src : video.thumbnail}
                                className="h-[520px] w-full rounded-2xl object-cover bg-black"
                                playsInline
                              />
                            ) : (
                              <>
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="h-[520px] w-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                                  <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                                    <Play className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="p-4">
                            <h5 className="font-semibold text-gray-800">
                              {video.title}
                            </h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EventCard = ({ event, onClick }) => {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-orange-400 to-purple-500 p-8">
          <div className="flex h-full flex-col justify-between">
            <div className="text-right">
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                Popular
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm">
                {event.icon}
              </div>
              <div className="text-right"></div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h4 className="mb-3 text-2xl font-bold text-gray-800">
            {event.title}
          </h4>
          <p className="mb-6 leading-relaxed text-gray-600">
            {event.shortDesc}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Flexible</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Groups</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium text-gray-700">4.9</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t bg-gray-50 p-6">
        <button
          onClick={onClick}
          className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 py-3 font-semibold text-white transition-all hover:shadow-lg transform hover:scale-105"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default EventsPage;