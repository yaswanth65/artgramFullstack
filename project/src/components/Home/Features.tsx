
import React from 'react';
import { Link } from 'react-router-dom';

const Features: React.FC = () => {
  return (
    <>
      <section
        id="activities"
        className="py-20 text-center bg-gradient-to-br from-slate-50 to-gray-100"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <h2 className="text-4xl font-black bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
              Explore activities at Artgram
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <ActivityCard
              img="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755538130/HAR05881_knyc5j.jpg"
              title="🎨 Art Making"
              text="Enjoy 30+ hands on activities for all age groups"
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/art-making-activity.html"
            />
            <ActivityCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754630801/HAR05956_c7944n.jpg"
              title="🌈 Slime Play"
              text="Get messy and creative with colorful, stretchy slime! Perfect for kids and adults who love sensory fun."
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/slime-play.html"
            />
            <ActivityCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651197/HAR05826_iefkzg.jpg"
              title="🧶 Tufting"
              text="Explore a new art form: make your own rugs and coasters to decorate your home."
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/tufting-activity.html"
            />
          </div>
        </div>
      </section>
      {/* Events Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center lg:justify-start">
              <a
                href="https://youtube.com/shorts/3Ho2S0v2PF0?si=jqswBjCvh31Vbd4u"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full max-w-lg h-72 rounded-2xl shadow-2xl border-4 border-gradient-to-r from-orange-200 to-orange-200 overflow-hidden relative"
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
              <h2 className="text-4xl font-black bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent mb-6">
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
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/events"
            />
            <EventCard
              icon="👶"
              title="Baby Shower"
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/events"
            />
            <EventCard
              icon="🏢"
              title="Corporate"
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/events"
            />
            <EventCard
              icon="🎨"
              title="Workshops"
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/events"
            />
          </div>
        </div>
      </section>
    </>
  );
};

type ActivityCardProps = {
  img: string;
  title: string;
  text: string;
  bgColor: string;
  link: string;
};

const ActivityCard: React.FC<ActivityCardProps> = ({ img, title, text, bgColor, link }) => {
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

type EventCardProps = {
  icon: string;
  title: string;
  bgColor: string;
  link: string;
};

const EventCard: React.FC<EventCardProps> = ({ icon, title, bgColor, link }) => {
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


export default Features;